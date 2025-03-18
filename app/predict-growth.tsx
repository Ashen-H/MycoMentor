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

export default function PredictGrowthScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [mushroomType, setMushroomType] = useState<string>("button");
  const [growthStage, setGrowthStage] = useState<string>("mycelium");

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

  const analyzeGrowth = () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of your mushroom growth first.");
      return;
    }
    
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const resetPrediction = () => {
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
        <Text style={styles.headerTitle}>Predict Growth</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        {!image && (
          <View style={styles.instructionsContainer}>
            <Ionicons name="leaf-outline" size={60} color="#6da77f" style={styles.instructionIcon} />
            <Text style={styles.instructionsTitle}>Growth Prediction</Text>
            <Text style={styles.instructionsText}>
              Take a photo of your growing mushrooms to predict their growth timeline, harvest date, and get personalized recommendations.
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
                style={[styles.typeButton, mushroomType === "button" && styles.selectedTypeButton]} 
                onPress={() => setMushroomType("button")}
              >
                <Text style={[styles.typeButtonText, mushroomType === "button" && styles.selectedTypeButtonText]}>
                  Button
                </Text>
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
            
            <Text style={styles.selectorLabel}>Growth Stage</Text>
            <View style={styles.typeButtonsContainer}>
              <TouchableOpacity 
                style={[styles.typeButton, growthStage === "mycelium" && styles.selectedTypeButton]} 
                onPress={() => setGrowthStage("mycelium")}
              >
                <Text style={[styles.typeButtonText, growthStage === "mycelium" && styles.selectedTypeButtonText]}>
                  Mycelium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, growthStage === "pinhead" && styles.selectedTypeButton]} 
                onPress={() => setGrowthStage("pinhead")}
              >
                <Text style={[styles.typeButtonText, growthStage === "pinhead" && styles.selectedTypeButtonText]}>
                  Pinhead
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, growthStage === "mature" && styles.selectedTypeButton]} 
                onPress={() => setGrowthStage("mature")}
              >
                <Text style={[styles.typeButtonText, growthStage === "mature" && styles.selectedTypeButtonText]}>
                  Mature
                </Text>
              </TouchableOpacity>
            </View>
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

        {/* Results Placeholder */}
        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Growth Prediction</Text>
            </View>
            
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>
                This is where the growth prediction results will be displayed. 
                You'll connect this to your model later.
              </Text>
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Growth Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "25%" }]} />
                <Text style={styles.progressText}>25% Complete</Text>
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
});