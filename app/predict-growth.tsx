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

// API base URL - replace with your actual API URL
const API_URL = "http://20.212.249.149:8000";

// Type definitions
interface PredictionResponse {
  class_counts: Record<string, number>;
  recommendation: string;
  confidence_scores: Record<string, number>;
}

// Class mapping for display
const CLASSES = {
  "0": "Pink Oyster- 2-3 days to harvest",
  "1": "Pink Oyster- 4-5 days to harvest",
  "2": "Pink Oyster- 6-7 days to harvest",
  "3": "Pink Oyster- Ready to harvest"
};

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

export default function PredictGrowthScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
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
        setShowResults(false); // Reset results when new image selected
        setAnnotatedImage(null); // Clear any previous annotated image
        setError(null); // Clear any previous errors
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
        setShowResults(false); // Reset results when new image selected
        setAnnotatedImage(null); // Clear any previous annotated image
        setError(null); // Clear any previous errors
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
    
    return formData;
  };

  // Send image to API for analysis
  const analyzeGrowth = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of your mushroom growth first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create form data
      const formData = await createFormData(image);
      
      // First get prediction data
      console.log(`Sending request to ${API_URL}/predict`);
      const predictionResponse = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!predictionResponse.ok) {
        throw new Error(`API error: ${predictionResponse.status}`);
      }
      
      // Parse prediction data
      const predictionData: PredictionResponse = await predictionResponse.json();
      setPredictionResults(predictionData);
      
      // Then get annotated image
      console.log(`Sending request to ${API_URL}/predict/image`);
      const imageResponse = await fetch(`${API_URL}/predict/image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Image API error: ${imageResponse.status}`);
      }
      
      // For React Native, we need to handle the image response differently
      // Convert the response to a base64 string we can use as image source
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64String = arrayBufferToBase64(arrayBuffer);
      setAnnotatedImage(`data:image/jpeg;base64,${base64String}`);
      setShowResults(true);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      Alert.alert("Analysis Failed", "Could not analyze the image. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset all states for a new prediction
  const resetPrediction = () => {
    setImage(null);
    setShowResults(false);
    setPredictionResults(null);
    setAnnotatedImage(null);
    setError(null);
    setImageExpanded(false);
  };

  // Calculate overall progress based on detected mushroom class
  const calculateProgress = (): number => {
    if (!predictionResults) return 0;
    
    // If there are any ready to harvest (class 3), return 100%
    if (predictionResults.class_counts["3"] > 0) {
      return 100;
    }
    
    // Base progress on recommendation instead of distribution count
    if (predictionResults.recommendation.includes("2-3 days")) {
      return 75;
    } else if (predictionResults.recommendation.includes("4-5 days")) {
      return 50;
    } else if (predictionResults.recommendation.includes("6-7 days")) {
      return 25;
    } else if (predictionResults.recommendation.includes("Ready")) {
      return 100;
    }
    
    return 25; // Default progress
  };

  // Format a confidence value as percentage
  const formatConfidence = (confidence: number): string => {
    return (confidence * 100).toFixed(1) + "%";
  };

  // Get confidence for the recommendation
  const getRecommendationConfidence = (): number => {
    if (!predictionResults || !predictionResults.recommendation) return 0;
    
    // Find which class corresponds to the recommendation
    for (const [key, value] of Object.entries(CLASSES)) {
      if (value === predictionResults.recommendation) {
        return predictionResults.confidence_scores[key] || 0;
      }
    }
    
    return 0;
  };

  // Render the result information from API
  const renderResultDetails = () => {
    if (!predictionResults) {
      return (
        <Text style={styles.resultText}>
          No mushrooms detected in the image. Try another photo with a clearer view of the mushrooms.
        </Text>
      );
    }
    
    const confidence = getRecommendationConfidence();
    
    return (
      <>
        <Text style={styles.resultItem}>
          <Text style={styles.resultLabel}>Recommendation: </Text>
          <Text style={styles.resultValue}>{predictionResults.recommendation}</Text>
        </Text>
        
        <Text style={styles.resultItem}>
          <Text style={styles.resultLabel}>Confidence: </Text>
          <Text style={styles.resultValue}>{formatConfidence(confidence)}</Text>
        </Text>
        
        <Text style={styles.resultNote}>
          Based on AI analysis, the model detected pink oyster mushrooms in your image. The highlighted areas in the image show the detected mushrooms.
        </Text>
        
        {/* Stage information based on recommendation */}
        <View style={styles.classCountsContainer}>
          <Text style={styles.classCountsTitle}>What this means:</Text>
          {predictionResults.recommendation.includes("Ready") && (
            <Text style={styles.classCountItem}>
              Your mushrooms appear to be fully developed and ready to harvest now!
            </Text>
          )}
          
          {predictionResults.recommendation.includes("2-3 days") && (
            <Text style={styles.classCountItem}>
              Your mushrooms are developing well but need 2-3 more days before optimal harvest time.
            </Text>
          )}
          
          {predictionResults.recommendation.includes("4-5 days") && (
            <Text style={styles.classCountItem}>
              Your mushrooms are growing but need 4-5 more days before they'll be ready to harvest.
            </Text>
          )}
          
          {predictionResults.recommendation.includes("6-7 days") && (
            <Text style={styles.classCountItem}>
              Your mushrooms are in early growth stage and need 6-7 more days before harvest.
            </Text>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Predict Growth</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        {!image && (
          <View style={styles.instructionsContainer}>
            <Ionicons name="leaf-outline" size={60} color="#6da77f" style={styles.instructionIcon} />
            <Text style={styles.instructionsTitle}>Harvest Prediction</Text>
            <Text style={styles.instructionsText}>
              Take a photo of your pink oyster mushrooms to predict when they'll be ready for harvest. Our AI will analyze your mushrooms and give you a recommendation.
            </Text>
          </View>
        )}

        {/* Image Preview */}
        {image && !showResults && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.mushroomImage} 
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetPrediction}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Annotated Image Result */}
        {showResults && annotatedImage && !imageExpanded && (
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={() => setImageExpanded(true)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: annotatedImage }} 
              style={styles.mushroomImage} 
            />
            <Text style={styles.annotatedImageLabel}>AI Detection Results (Tap to expand)</Text>
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
            <TouchableOpacity style={[styles.imageButton, { backgroundColor: "#6da77f" }]} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.imageButton, { backgroundColor: "#6da77f" }]} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#fff" />
              <Text style={styles.buttonText}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analyze Button */}
        {image && !showResults && !isAnalyzing && (
          <TouchableOpacity style={[styles.analyzeButton, { backgroundColor: "#6da77f" }]} onPress={analyzeGrowth}>
            <Text style={styles.analyzeButtonText}>Analyze Mushrooms</Text>
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6da77f" />
            <Text style={styles.loadingText}>Analyzing mushroom growth...</Text>
          </View>
        )}

        {/* Results Display */}
        {showResults && predictionResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Harvest Prediction</Text>
            </View>
            
            <View style={styles.resultContent}>
              {renderResultDetails()}
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Growth Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${calculateProgress()}%`, backgroundColor: "#6da77f" }]} />
                <Text style={styles.progressText}>{calculateProgress()}% Complete</Text>
              </View>
            </View>
            
            <TouchableOpacity style={[styles.newSearchButton, { backgroundColor: "#6da77f" }]} onPress={resetPrediction}>
              <Text style={styles.newSearchText}>New Prediction</Text>
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
  resultHeader: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  resultContent: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  resultItem: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  resultLabel: {
    fontWeight: "bold",
    color: "#444",
  },
  resultValue: {
    color: "#222",
  },
  resultNote: {
    marginTop: 12,
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
  classCountsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  classCountsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  classCountItem: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  progressSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  newSearchButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  newSearchText: {
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