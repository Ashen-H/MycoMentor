import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AboutScreen() {
  const appVersion = "1.0.0"; // Update with your actual app version
  
  const openWebsite = () => {
    Linking.openURL("https://your-website.com"); // Replace with your actual website
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://your-website.com/privacy-policy"); // Replace with your actual policy URL
  };

  const openTermsOfService = () => {
    Linking.openURL("https://your-website.com/terms-of-service"); // Replace with your actual terms URL
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About MYCOMENTOR</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/mushroom-bg.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>MYCOMENTOR</Text>
          <Text style={styles.appVersion}>Version {appVersion}</Text>
        </View>

        {/* App Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            MYCOMENTOR is dedicated to simplifying mushroom farming through technology. 
            Our app provides tools for detection, growth prediction, and disease identification 
            to help both beginners and experienced farmers maximize their yields.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="search" size={24} color="#6da77f" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Mushroom Detection</Text>
              <Text style={styles.featureDescription}>
                Identify mushroom species with our advanced image recognition technology.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#6da77f" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Growth Prediction</Text>
              <Text style={styles.featureDescription}>
                Get accurate growth forecasts based on environmental conditions.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="medkit" size={24} color="#6da77f" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Disease Identification</Text>
              <Text style={styles.featureDescription}>
                Detect and manage diseases early to protect your mushroom crops.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="thermometer" size={24} color="#6da77f" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Environmental Monitoring</Text>
              <Text style={styles.featureDescription}>
                Track temperature, humidity, and other critical growing conditions.
              </Text>
            </View>
          </View>
        </View>

        {/* Company Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <Text style={styles.companyName}>MycoTech Solutions</Text>
          <Text style={styles.companyAddress}>
            123 Fungi Street, Mushroom Valley
          </Text>
          <TouchableOpacity onPress={openWebsite} style={styles.linkButton}>
            <Text style={styles.linkText}>www.mycomentor.com</Text>
          </TouchableOpacity>
          <Text style={styles.copyright}>© 2025 MycoTech Solutions. All rights reserved.</Text>
        </View>

        {/* Legal Links */}
        <View style={styles.legalContainer}>
          <TouchableOpacity onPress={openPrivacyPolicy} style={styles.legalButton}>
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openTermsOfService} style={styles.legalButton}>
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
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
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    color: "#6da77f",
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  companyAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#6da77f",
    textDecorationLine: "underline",
  },
  copyright: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
  },
  legalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  legalButton: {
    paddingHorizontal: 12,
  },
  legalButtonText: {
    fontSize: 14,
    color: "#6da77f",
    textDecorationLine: "underline",
  },
});