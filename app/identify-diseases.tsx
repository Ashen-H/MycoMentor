import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// API base URL
const API_URL = "http://20.212.249.149:6666";

// Type definitions
interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface PredictionResponse {
  filename?: string;
  original_url?: string;
  inference_time: number;
  detections: Detection[];
  count: number;
  image_url: string;
  image_name: string;
  direct_image_url: string;
}

// Helper function to convert ArrayBuffer to base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export default function IdentifyDiseasesScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [predictionResults, setPredictionResults] = useState<PredictionResponse | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageExpanded, setImageExpanded] = useState<boolean>(false);

  // Request camera and media library permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to use this feature."
      );
      return false;
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        setAnnotatedImage(null); // Clear any previous annotated image
        setError(null); // Clear any previous errors
        setPredictionResults(null); // Clear any previous results
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image from gallery");
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        setAnnotatedImage(null); // Clear any previous annotated image
        setError(null); // Clear any previous errors
        setPredictionResults(null); // Clear any previous results
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Create form data for the image upload
  const createFormData = async (uri: string) => {
    const formData = new FormData();
    
    // Get file name from URI
    const fileName = uri.split("/").pop() || "mushroom.jpg";
    
    // Determine MIME type
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    
    // Append file to form data
    formData.append("file", {
      uri,
      name: fileName,
      type
    } as any);
    
    // Set confidence threshold
    formData.append("conf", "0.25");
    
    // Save annotated image
    formData.append("save_image", "true");
    
    return formData;
  };

  // Send image to API for analysis
  const analyzeDiseases = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of your mushrooms first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create form data
      const formData = await createFormData(image);
      
      // Send to API for prediction
      console.log(`Sending request to ${API_URL}/predict`);
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Parse prediction data
      const predictionData: PredictionResponse = await response.json();
      console.log("Prediction data:", predictionData);
      setPredictionResults(predictionData);
      
      // Get the annotated image
      if (predictionData.direct_image_url) {
        const imageUrl = `${API_URL}${predictionData.direct_image_url}`;
        console.log("Fetching annotated image from:", imageUrl);
        
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Image fetch error: ${imageResponse.status}`);
        }
        
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        setAnnotatedImage(`data:image/jpeg;base64,${base64String}`);
      }
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      Alert.alert("Analysis Failed", "Could not analyze the image. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset all states for a new prediction
  const resetDiagnosis = () => {
    setImage(null);
    setPredictionResults(null);
    setAnnotatedImage(null);
    setError(null);
    setImageExpanded(false);
  };

  // Format a confidence value as percentage
  const formatConfidence = (confidence: number): string => {
    return (confidence * 100).toFixed(1) + "%";
  };

  // Render results based on API response
  const renderResultDetails = () => {
    if (!predictionResults) return null;
    
    // Check if any mushroom types were detected
    if (predictionResults.detections.length === 0) {
      return (
        <View style={styles.noDetectionsContainer}>
          <View style={styles.statusIconContainer}>
            <Ionicons name="warning-outline" size={60} color="#F57C00" />
          </View>
          <Text style={styles.noDetectionsTitle}>No Mushrooms Detected</Text>
          <Text style={styles.noDetectionsText}>
            No identifiable mushrooms were found in this image. Please ensure your photo clearly shows the mushrooms.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.detectionResults}>
        <Text style={styles.resultsTitle}>Analysis Results</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Detections</Text>
          {predictionResults.detections.map((detection, index) => (
            <View key={index} style={styles.detectionItem}>
              <View style={styles.detectionHeader}>
                <Text style={styles.detectionClass}>{detection.class}</Text>
                <Text style={styles.detectionConfidence}>
                  Confidence: {formatConfidence(detection.confidence)}
                </Text>
              </View>
              <View style={styles.detectionBbox}>
                <Text style={styles.bboxLabel}>Bounding Box:</Text>
                <Text style={styles.bboxCoordinates}>
                  [{detection.bbox[0].toFixed(1)}, {detection.bbox[1].toFixed(1)}, {detection.bbox[2].toFixed(1)}, {detection.bbox[3].toFixed(1)}]
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Objects Detected:</Text>
            <Text style={styles.summaryValue}>{predictionResults.count}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Processing Time:</Text>
            <Text style={styles.summaryValue}>{predictionResults.inference_time.toFixed(2)} seconds</Text>
          </View>
        </View>
        
        {/* Diseases check - just based on naming convention, can be customized */}
        <View style={styles.healthSection}>
          <View style={styles.statusIconContainer}>
            {predictionResults.detections.some(d => 
              d.class.toLowerCase().includes("disease") || 
              d.class.toLowerCase().includes("mold") ||
              d.class.toLowerCase().includes("contaminant")
            ) ? (
              <>
                <Ionicons name="warning" size={40} color="#F44336" />
                <Text style={styles.healthStatus}>Disease Detected</Text>
                <Text style={styles.healthDescription}>
                  The analysis detected potential issues. See the annotated image for details.
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                <Text style={styles.healthyStatus}>No Disease Detected</Text>
                <Text style={styles.healthyDescription}>
                  No signs of disease or contamination were detected in the analyzed image.
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identify Diseases</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        {!image && (
          <View style={styles.instructionsContainer}>
            <Ionicons name="medkit-outline" size={60} color="#6da77f" style={styles.instructionIcon} />
            <Text style={styles.instructionsTitle}>Disease Diagnosis</Text>
            <Text style={styles.instructionsText}>
              Take a clear photo of any concerning areas on your mushrooms or growing substrate to identify potential diseases and get treatment recommendations.
            </Text>
          </View>
        )}

        {/* Image Preview */}
        {image && !annotatedImage && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.mushroomImage} 
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetDiagnosis}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Annotated Image Result */}
        {annotatedImage && !imageExpanded && (
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={() => setImageExpanded(true)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: annotatedImage }} 
              style={styles.mushroomImage} 
            />
            <Text style={styles.annotatedImageLabel}>Detection Results (Tap to expand)</Text>
          </TouchableOpacity>
        )}
        
        {/* Expanded Image Modal */}
        {imageExpanded && annotatedImage && (
          <View style={styles.expandedImageContainer}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setImageExpanded(false)}
            >
              <Ionicons name="close-circle" size={36} color="#fff" />
            </TouchableOpacity>
            <Image 
              source={{ uri: annotatedImage }} 
              style={styles.expandedImage} 
              resizeMode="contain"
            />
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#d95555" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Image Selection Buttons */}
        {!image && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#fff" />
              <Text style={styles.buttonText}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analyze Button */}
        {image && !annotatedImage && !isAnalyzing && (
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeDiseases}>
            <Text style={styles.analyzeButtonText}>Identify Diseases</Text>
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6da77f" />
            <Text style={styles.loadingText}>Analyzing for potential diseases...</Text>
          </View>
        )}

        {/* Results Display */}
        {annotatedImage && (
          <View style={styles.resultsContainer}>
            {renderResultDetails()}
            
            <TouchableOpacity style={styles.newScanButton} onPress={resetDiagnosis}>
              <Text style={styles.newScanText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusIconContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  instructionsContainer: {
    padding: 24,
    alignItems: "center",
  },
  instructionIcon: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  instructionsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  imageContainer: {
    position: "relative",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mushroomImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  resetButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 4,
  },
  annotatedImageLabel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  expandedImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  expandedImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 11,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  imageButton: {
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 0.45,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  analyzeButton: {
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyzeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  // Detections Results
  detectionResults: {
    width: "100%",
  },
  infoSection: {
    marginVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  detectionItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detectionClass: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detectionConfidence: {
    fontSize: 14,
    color: "#666",
  },
  detectionBbox: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bboxLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 6,
  },
  bboxCoordinates: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  // Health Section
  healthSection: {
    marginVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
    marginTop: 8,
    marginBottom: 4,
  },
  healthyStatus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 8,
    marginBottom: 4,
  },
  healthDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  healthyDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  // No Detections
  noDetectionsContainer: {
    alignItems: "center",
    backgroundColor: "#fff9c4",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  noDetectionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57C00",
    marginVertical: 8,
  },
  noDetectionsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  newScanButton: {
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  newScanText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: "#fff8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffdddd",
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
    color: "#d95555",
    fontSize: 14,
  }
});