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

// Define types for our data
interface DiseaseResult {
  diseaseDetected: true;
  diseaseName: string;
  severity: string;
  affectedAreas: string[];
  symptoms: string[];
  causes: string[];
  treatmentOptions: {
    title: string;
    steps: string[];
  }[];
  spreadRisk: string;
  impactOnHarvest: string;
  healthRisks: string;
}

interface HealthyResult {
  diseaseDetected: false;
  healthStatus: string;
  notes: string[];
  recommendations: string[];
}

type AnalysisResult = DiseaseResult | HealthyResult;

export default function IdentifyDiseasesScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  // Mock data for disease identification results
  const mockDiseaseResults: DiseaseResult = {
    diseaseDetected: true,
    diseaseName: "Green Mold (Trichoderma)",
    severity: "Moderate",
    affectedAreas: ["Substrate", "Base of fruiting bodies"],
    symptoms: [
      "Green to turquoise colored patches",
      "Powdery or fuzzy texture",
      "Rapid spreading",
      "Sweet or earthy odor"
    ],
    causes: [
      "Contaminated substrate",
      "Poor sterilization",
      "Excessive moisture",
      "Exposure to airborne spores"
    ],
    treatmentOptions: [
      {
        title: "Immediate Actions",
        steps: [
          "Isolate the affected container",
          "Remove visibly contaminated areas if possible",
          "Clean surrounding areas with 70% isopropyl alcohol"
        ]
      },
      {
        title: "Treatment",
        steps: [
          "In severe cases, discard the affected substrate",
          "For mild cases, increase ventilation",
          "Reduce humidity to slow spread",
          "Apply hydrogen peroxide (3%) to affected areas"
        ]
      },
      {
        title: "Prevention",
        steps: [
          "Maintain strict hygiene during cultivation",
          "Properly sterilize all substrates",
          "Use clean tools and equipment",
          "Control environmental conditions"
        ]
      }
    ],
    spreadRisk: "High",
    impactOnHarvest: "Significant yield reduction if not controlled",
    healthRisks: "Some Trichoderma species can produce mycotoxins. Avoid inhaling spores and wash hands after handling."
  };

  const healthyMockResults: HealthyResult = {
    diseaseDetected: false,
    healthStatus: "Healthy",
    notes: [
      "No visible signs of disease or contamination",
      "Good mycelial growth",
      "Normal coloration",
      "Healthy fruiting bodies"
    ],
    recommendations: [
      "Continue current growing conditions",
      "Maintain hygiene protocols",
      "Monitor regularly for any changes",
      "Ensure proper air exchange and humidity levels"
    ]
  };

  // Mock image picker functions
  const pickImage = async () => {
    // Simulate picking an image
    setImage("https://example.com/sample-image.jpg");
    Alert.alert("Image Selected", "An image would be selected from your gallery here.");
  };

  const takePhoto = async () => {
    // Simulate taking a photo
    setImage("https://example.com/sample-photo.jpg");
    Alert.alert("Photo Taken", "A photo would be taken with your camera here.");
  };

  const analyzeDiseases = () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of your mushrooms first.");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Randomly choose between disease detected and healthy for demo purposes
      const hasDisease = Math.random() > 0.3;
      setResults(hasDisease ? mockDiseaseResults : healthyMockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetDiagnosis = () => {
    setImage(null);
    setResults(null);
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
        {image && (
          <View style={styles.imageContainer}>
            {/* Use a placeholder image for the demo */}
            <Image 
              source={require('../assets/images/mushroom-bg.png')} 
              style={styles.mushroomImage} 
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetDiagnosis}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
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
        {image && !results && !isAnalyzing && (
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

        {/* Results - Healthy */}
        {results && !results.diseaseDetected && (
          <View style={styles.resultsContainer}>
            <View style={styles.healthyStatus}>
              <View style={styles.statusIconContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.healthyTitle}>{results.healthStatus}</Text>
              <Text style={styles.healthyDescription}>
                No signs of disease or contamination detected
              </Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Observations</Text>
              {results.notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {results.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="information-circle" size={16} color="#6da77f" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.newScanButton} onPress={resetDiagnosis}>
              <Text style={styles.newScanText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results - Disease */}
        {results && results.diseaseDetected && (
          <View style={styles.resultsContainer}>
            <View style={styles.diseaseStatus}>
              <View style={styles.statusIconContainer}>
                <Ionicons name="warning" size={60} color="#F44336" />
              </View>
              <Text style={styles.diseaseTitle}>{results.diseaseName}</Text>
              <View style={styles.severityContainer}>
                <Text style={styles.severityLabel}>Severity:</Text>
                <Text style={styles.severityText}>{results.severity}</Text>
              </View>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Affected Areas</Text>
              <View style={styles.tagContainer}>
                {results.affectedAreas.map((area, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              {results.symptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <Ionicons name="remove-circle" size={16} color="#F44336" />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Causes</Text>
              {results.causes.map((cause, index) => (
                <View key={index} style={styles.causeItem}>
                  <Text style={styles.causeNumber}>{index + 1}.</Text>
                  <Text style={styles.causeText}>{cause}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Treatment Plan</Text>
              {results.treatmentOptions.map((option, index) => (
                <View key={index} style={styles.treatmentSection}>
                  <Text style={styles.treatmentTitle}>{option.title}</Text>
                  {option.steps.map((step, stepIndex) => (
                    <View key={stepIndex} style={styles.treatmentStep}>
                      <Ionicons name="arrow-forward-circle" size={16} color="#6da77f" />
                      <Text style={styles.treatmentText}>{step}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            
            <View style={styles.riskSection}>
              <View style={styles.riskItem}>
                <Text style={styles.riskLabel}>Spread Risk:</Text>
                <Text style={[
                  styles.riskValue, 
                  results.spreadRisk === "High" ? styles.highRisk : 
                  results.spreadRisk === "Medium" ? styles.mediumRisk : 
                  styles.lowRisk
                ]}>
                  {results.spreadRisk}
                </Text>
              </View>
              
              <View style={styles.riskItem}>
                <Text style={styles.impactLabel}>Impact on Harvest:</Text>
                <Text style={styles.impactText}>{results.impactOnHarvest}</Text>
              </View>
            </View>
            
            <View style={styles.healthWarning}>
              <Ionicons name="alert-circle" size={24} color="#F57C00" />
              <Text style={styles.healthWarningText}>{results.healthRisks}</Text>
            </View>
            
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
  // Healthy Results Styles
  healthyStatus: {
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  statusIconContainer: {
    marginBottom: 12,
  },
  healthyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  healthyDescription: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  recommendationText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  // Disease Results Styles
  diseaseStatus: {
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  diseaseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F44336",
    marginBottom: 8,
    textAlign: "center",
  },
  severityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  severityLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  severityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#f1f8e9",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#6da77f",
    fontSize: 14,
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
  },
  symptomText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  causeItem: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  causeNumber: {
    width: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "#6da77f",
  },
  causeText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  treatmentSection: {
    backgroundColor: "#f1f8e9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6da77f",
    marginBottom: 8,
  },
  treatmentStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  treatmentText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  riskSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  riskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  riskLabel: {
    fontSize: 14,
    color: "#333",
    width: 100,
  },
  riskValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  highRisk: {
    color: "#F44336",
  },
  mediumRisk: {
    color: "#FF9800",
  },
  lowRisk: {
    color: "#4CAF50",
  },
  impactLabel: {
    fontSize: 14,
    color: "#333",
    width: 140,
  },
  impactText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  healthWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  healthWarningText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
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
});