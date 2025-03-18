import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RateAppScreen() {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRateOnStore = () => {
    // URLs for app stores (replace with your actual app IDs)
    const appStoreUrl = "https://apps.apple.com/app/idYOUR_APP_ID";
    const playStoreUrl = "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME";
    
    // Open appropriate store based on platform
    if (Platform.OS === 'ios') {
      Linking.openURL(appStoreUrl);
    } else {
      Linking.openURL(playStoreUrl);
    }
  };

  const handleFeedbackInstead = () => {
    // Navigate to feedback form or contact screen
    router.push('/help-feedback');
  };

  const handleRatingSelected = (rating: number) => {
    setSelectedRating(rating);
    
    if (rating >= 4) {
      // For high ratings, prompt to go to the store
      Alert.alert(
        "Thank You!",
        "We're glad you're enjoying MYCOMENTOR! Would you like to share your experience on the app store?",
        [
          { text: "Not Now", style: "cancel" },
          { 
            text: "Rate on Store", 
            onPress: handleRateOnStore 
          }
        ]
      );
    } else {
      // For lower ratings, prompt for feedback
      Alert.alert(
        "Thank You for Your Feedback",
        "We'd love to hear how we can improve your experience with MYCOMENTOR.",
        [
          { text: "Not Now", style: "cancel" },
          { 
            text: "Give Feedback", 
            onPress: handleFeedbackInstead 
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate the App</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require("../assets/images/mushroom-bg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Enjoying MYCOMENTOR?</Text>
        
        <Text style={styles.description}>
          Your feedback helps us improve the app and provide better tools for mushroom farming!
        </Text>

        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity 
              key={rating} 
              onPress={() => handleRatingSelected(rating)}
              style={styles.starButton}
            >
              <Ionicons 
                name={rating <= selectedRating ? "star" : "star-outline"} 
                size={48} 
                color={rating <= selectedRating ? "#FFC107" : "#BBBBBB"} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.ratingText}>
          {selectedRating > 0 ? `You selected ${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Tap a star to rate'}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.storeButton]} 
            onPress={handleRateOnStore}
          >
            <Ionicons name="star" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Rate on Store</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.feedbackButton]} 
            onPress={handleFeedbackInstead}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#6da77f" style={styles.buttonIcon} />
            <Text style={styles.feedbackButtonText}>Send Feedback Instead</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.thankYouText}>
          Thank you for helping us grow!
        </Text>
      </View>
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  storeButton: {
    backgroundColor: "#6da77f",
  },
  feedbackButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6da77f",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackButtonText: {
    color: "#6da77f",
    fontSize: 16,
    fontWeight: "bold",
  },
  thankYouText: {
    fontSize: 14,
    color: "#666",
    marginTop: 32,
    fontStyle: "italic",
  },
});