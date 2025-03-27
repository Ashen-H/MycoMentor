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

// API base URL - change to your Flask server address
const API_URL = "http://192.168.1.200:5000";

// Type definitions
interface PredictionResult {
  class: string;
  confidence: number;
  harvesting_estimate: string;
  bounding_box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
  };
}

interface ApiResponse {
  predictions: PredictionResult[];
  processing_time_ms: number;
  image_dimensions: {
    width: number;
    height: number;
  };
}

export default function PredictGrowthScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [mushroomType, setMushroomType] = useState<string>("pink_oyster");
  const [predictionResults, setPredictionResults] = useState<PredictionResult[]>([]);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Convert image to base64
  const getBase64FromUri = async (uri: string): Promise<string> => {
    try {
      // Check if we already have base64 data
      if (uri.startsWith('data:image')) {
        return uri.split(',')[1]; // Return the base64 part only
      }
      
      // Read the file and convert to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting to base64:", error);
      throw new Error("Failed to convert image");
    }
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
      // Get base64 data
      const base64Data = await getBase64FromUri(image);
      
      // Prepare request body
      const body = JSON.stringify({
        image: base64Data,
        mushroom_type: mushroomType
      });
      
      console.log(`Sending request to ${API_URL}/predict with selected mushroom type: ${mushroomType}`);
      
      // Send request to API
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      // Parse response
      const data: ApiResponse = await response.json();
      console.log("Received data:", data);
      
      // Check if we have any predictions
      if (!data.predictions || data.predictions.length === 0) {
        setError("No mushrooms detected in the image. Please try another photo with a clearer view.");
      } else {
        // Store results
        setPredictionResults(data.predictions);
        setProcessingTime(data.processing_time_ms);
        setShowResults(true);
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
  const resetPrediction = () => {
    setImage(null);
    setShowResults(false);
    setPredictionResults([]);
    setProcessingTime(0);
    setError(null);
  };

  // Calculate overall progress based on detected mushroom type
  const calculateProgress = (): number => {
    if (predictionResults.length === 0) return 25; // Default progress
    
    // Simple progress calculation based on confidence
    const topPrediction = predictionResults[0];
    
    // Base progress starts at 50%
    const baseProgress = 50;
    
    // Add up to 40% based on confidence
    const confidenceBoost = Math.floor(topPrediction.confidence * 40);
    
    // Return total progress capped at 95%
    return Math.min(95, baseProgress + confidenceBoost);
  };

  // Format a confidence value as percentage
  const formatConfidence = (confidence: number): string => {
    return (confidence * 100).toFixed(1) + "%";
  };

  // Render the result information from API
  const renderResultDetails = () => {
    if (predictionResults.length === 0) {
      return (
        <Text style={styles.resultText}>
          No mushrooms detected in the image. Try another photo with a clearer view of the mushrooms.
        </Text>
      );
    }
    
    // Show top prediction
    const topPrediction = predictionResults[0];
    
    return (
      <>
        <Text style={styles.resultItem}>
          <Text style={styles.resultLabel}>Mushroom Type: </Text>
          <Text style={styles.resultValue}>{topPrediction.class.replace('_', ' ')}</Text>
        </Text>
        
        <Text style={styles.resultItem}>
          <Text style={styles.resultLabel}>Confidence: </Text>
          <Text style={styles.resultValue}>{formatConfidence(topPrediction.confidence)}</Text>
        </Text>
        
        <Text style={styles.resultItem}>
          <Text style={styles.resultLabel}>Estimated Harvest Time: </Text>
          <Text style={styles.resultValue}>{topPrediction.harvesting_estimate}</Text>
        </Text>
        
        <Text style={styles.resultNote}>
          {predictionResults.length > 1 
            ? `We detected ${predictionResults.length} mushrooms in the image.` 
            : `We detected 1 mushroom in the image.`}
          {processingTime > 0 && ` Processing time: ${processingTime}ms`}
        </Text>
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
            <Text style={styles.instructionsTitle}>Growth Prediction</Text>
            <Text style={styles.instructionsText}>
              Take a photo of your growing mushrooms to predict their growth timeline and harvest date. This model works best with Pink Oyster mushrooms.
            </Text>
          </View>
        )}

        {/* Image Preview */}
        {image && (
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

        {/* Mushroom Type Selector */}
        {image && !showResults && (
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Mushroom Type</Text>
            <View style={styles.typeButtonsContainer}>
              <TouchableOpacity 
                style={[styles.typeButton, mushroomType === "pink_oyster" && styles.selectedTypeButton, styles.recommendedButton]} 
                onPress={() => setMushroomType("pink_oyster")}
              >
                <Text style={[styles.typeButtonText, mushroomType === "pink_oyster" && styles.selectedTypeButtonText]}>
                  Pink Oyster
                </Text>
                <Text style={styles.recommendedLabel}>Recommended</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, mushroomType === "oyster" && styles.selectedTypeButton]} 
                onPress={() => setMushroomType("oyster")}
              >
                <Text style={[styles.typeButtonText, mushroomType === "oyster" && styles.selectedTypeButtonText]}>
                  Oyster
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, mushroomType === "shiitake" && styles.selectedTypeButton]} 
                onPress={() => setMushroomType("shiitake")}
              >
                <Text style={[styles.typeButtonText, mushroomType === "shiitake" && styles.selectedTypeButtonText]}>
                  Shiitake
                </Text>
              </TouchableOpacity>
            </View>
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
        {image && !showResults && !isAnalyzing && (
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeGrowth}>
            <Text style={styles.analyzeButtonText}>Predict Growth</Text>
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6da77f" />
            <Text style={styles.loadingText}>Analyzing growth pattern...</Text>
          </View>
        )}

        {/* Results Display */}
        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Growth Prediction</Text>
            </View>
            
            <View style={styles.resultContent}>
              {renderResultDetails()}
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Growth Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${calculateProgress()}%` }]} />
                <Text style={styles.progressText}>{calculateProgress()}% Complete</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.newSearchButton} onPress={resetPrediction}>
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
  selectorContainer: {
    padding: 16,
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  typeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 0.32,
    alignItems: "center",
  },
  selectedTypeButton: {
    backgroundColor: "#6da77f",
    borderColor: "#6da77f",
  },
  typeButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  selectedTypeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recommendedButton: {
    borderColor: "#6da77f",
    borderWidth: 2,
  },
  recommendedLabel: {
    fontSize: 10,
    color: "#6da77f",
    marginTop: 4,
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
    backgroundColor: "#6da77f",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  newSearchButton: {
    backgroundColor: "#6da77f",
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