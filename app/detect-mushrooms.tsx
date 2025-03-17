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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DetectMushroomsScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const pickImage = () => {
    // Placeholder for image picker functionality
    setImage("image_selected");
    Alert.alert("Gallery", "Image selected from gallery");
  };

  const takePhoto = () => {
    // Placeholder for camera functionality
    setImage("photo_taken");
    Alert.alert("Camera", "Photo taken with camera");
  };

  const analyzeImage = () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of a mushroom first.");
      return;
    }
    
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const resetDetection = () => {
    setImage(null);
    setShowResults(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detect Mushrooms</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        {!image && (
          <View style={styles.instructionsContainer}>
            <Ionicons name="scan-outline" size={60} color="#6da77f" style={styles.instructionIcon} />
            <Text style={styles.instructionsTitle}>Mushroom Identification</Text>
            <Text style={styles.instructionsText}>
              Take a clear photo of the mushroom or select one from your gallery. Make sure to capture the cap, gills, and stem for the most accurate identification.
            </Text>
          </View>
        )}

        {/* Image Preview */}
        {image && (
          <View style={styles.imageContainer}>
            {/* Use a placeholder image for the demo */}
            <Image 
              source={require('../assets/images/mushroom-bg.png')} 
              style={styles.mushroomImage} 
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetDetection}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Image Selection Buttons */}
        {!showResults && (
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
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
            <Text style={styles.analyzeButtonText}>Identify Mushroom</Text>
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6da77f" />
            <Text style={styles.loadingText}>Analyzing mushroom...</Text>
          </View>
        )}

        {/* Results Placeholder */}
        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Identification Results</Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>90% Match</Text>
              </View>
            </View>
            
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>
                This is where the mushroom detection results will be displayed. 
                You'll connect this to your model later.
              </Text>
            </View>
            
            <TouchableOpacity style={styles.newSearchButton} onPress={resetDetection}>
              <Text style={styles.newSearchText}>New Identification</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  confidenceContainer: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confidenceText: {
    color: "#4CAF50",
    fontWeight: "bold",
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
});