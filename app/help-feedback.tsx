import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
interface ExpandedState {
    [key: number]: boolean;
  }
  
  export default function HelpFeedbackScreen() {
    const [activeTab, setActiveTab] = useState("help");
    const [feedbackType, setFeedbackType] = useState("general");
    const [feedbackText, setFeedbackText] = useState("");
    const [expanded, setExpanded] = useState<ExpandedState>({});
  
    const toggleFAQ = (id: number): void => {
      setExpanded(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim().length === 0) {
      Alert.alert("Error", "Please enter your feedback before submitting.");
      return;
    }
    
    // Here you would implement actual submission logic
    
    // Show success message
    Alert.alert(
      "Thank You!",
      "Your feedback has been received. We appreciate your input!",
      [{ text: "OK", onPress: () => {
        setFeedbackText("");
        Keyboard.dismiss();
      }}]
    );
  };

  const faqItems = [
    {
      id: 1,
      question: "How do I detect mushroom species?",
      answer: "To detect mushroom species, go to the 'Detect Mushrooms' section from the home screen. Take a clear photo of the mushroom, making sure it's well-lit and centered in the frame. Our AI will analyze the image and provide the most likely species identification along with confidence level."
    },
    {
      id: 2,
      question: "What growing conditions do mushrooms need?",
      answer: "Most mushrooms thrive in humid environments (70-90% humidity) with temperatures between 55-75°F (13-24°C), though requirements vary by species. They typically need indirect light, good air circulation, and a substrate rich in nutrients. The environmental monitoring tools in the app can help you track these conditions."
    },
    {
      id: 3,
      question: "How can I identify mushroom diseases?",
      answer: "Use the 'Identify Diseases' feature to take photos of potentially diseased mushrooms. Look for discoloration, unusual growth patterns, or contamination. The app will analyze the images and provide information about possible diseases and treatment options."
    },
    {
      id: 4,
      question: "How accurate is the growth prediction?",
      answer: "Our growth prediction algorithm is based on environmental data, mushroom species, and growing conditions. It typically achieves 80-90% accuracy when all environmental sensors are properly calibrated and regular updates are provided. The more data you input, the more accurate the predictions become."
    },
    {
      id: 5,
      question: "Can I use the app offline?",
      answer: "Some features of the app work offline, including viewing previously saved data and basic information. However, the detection, disease identification, and growth prediction features require an internet connection to access our AI systems."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Feedback</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "help" && styles.activeTab]} 
          onPress={() => setActiveTab("help")}
        >
          <Text style={[styles.tabText, activeTab === "help" && styles.activeTabText]}>
            Help & FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "feedback" && styles.activeTab]} 
          onPress={() => setActiveTab("feedback")}
        >
          <Text style={[styles.tabText, activeTab === "feedback" && styles.activeTabText]}>
            Send Feedback
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        {activeTab === "help" ? (
          // Help & FAQs Tab Content
          <ScrollView style={styles.scrollView}>
            <View style={styles.faqContainer}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              
              {faqItems.map((item) => (
                <View key={item.id} style={styles.faqItem}>
                  <TouchableOpacity 
                    style={styles.faqQuestion} 
                    onPress={() => toggleFAQ(item.id)}
                  >
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                    <Ionicons 
                      name={expanded[item.id] ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6da77f" 
                    />
                  </TouchableOpacity>
                  
                  {expanded[item.id] && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Still Need Help?</Text>
              <Text style={styles.contactText}>
                If you couldn't find the answer you're looking for, feel free to contact our support team directly.
              </Text>
              
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="mail-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.contactButtonText}>Email Support</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          // Feedback Tab Content
          <ScrollView style={styles.scrollView}>
            <View style={styles.feedbackContainer}>
              <Text style={styles.sectionTitle}>Send Us Your Feedback</Text>
              <Text style={styles.feedbackDescription}>
                We value your input! Please share your thoughts, suggestions, or report any issues you've encountered.
              </Text>
              
              <Text style={styles.inputLabel}>Feedback Type</Text>
              <View style={styles.feedbackTypeContainer}>
                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "general" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("general")}
                >
                  <Text style={[styles.feedbackTypeText, feedbackType === "general" && styles.selectedFeedbackTypeText]}>
                    General
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "bug" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("bug")}
                >
                  <Text style={[styles.feedbackTypeText, feedbackType === "bug" && styles.selectedFeedbackTypeText]}>
                    Bug Report
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "feature" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("feature")}
                >
                  <Text style={[styles.feedbackTypeText, feedbackType === "feature" && styles.selectedFeedbackTypeText]}>
                    Feature Request
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Your Feedback</Text>
              <TextInput
                style={styles.feedbackInput}
                multiline
                placeholder={
                  feedbackType === "bug" 
                    ? "Please describe the issue in detail. What happened? What did you expect to happen?"
                    : feedbackType === "feature"
                    ? "What feature would you like to see? How would it help you?"
                    : "Share your thoughts or suggestions with us..."
                }
                value={feedbackText}
                onChangeText={setFeedbackText}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6da77f",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#6da77f",
    fontWeight: "bold",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  // FAQ Styles
  faqContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  faqItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 8,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    color: "#333",
  },
  faqAnswer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  contactSection: {
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6da77f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "80%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  // Feedback Styles
  feedbackContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  feedbackDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  feedbackTypeContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  feedbackTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  selectedFeedbackType: {
    backgroundColor: "#6da77f",
    borderColor: "#6da77f",
  },
  feedbackTypeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedFeedbackTypeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  feedbackInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 24,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6da77f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});