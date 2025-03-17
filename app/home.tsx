import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, User!</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to </Text>
        <Text style={styles.appName}>MYCOMENTOR</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here for tools..."
          placeholderTextColor="#666"
        />
      </View>

      {/* Main Features Grid */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.featuresGrid}>
          {/* Row 1 */}
          <View style={styles.featuresRow}>
            <TouchableOpacity style={styles.featureCard}>
              <Image
                source={require("../assets/images/Detect-mushroom.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Detect Mushrooms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Image
                source={require("../assets/images/Predict-Growth.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Predict Growth</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.featuresRow}>
            <TouchableOpacity style={styles.featureCard}>
              <Image
                source={require("../assets/images/Identify-Diseases.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Identify Diseases</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Image
                source={require("../assets/images/Market-Place.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Market Place</Text>
            </TouchableOpacity>
          </View>

          {/* Row 3 */}
          <View style={styles.featuresRow}>
            <TouchableOpacity style={styles.featureCard}>
              <Image
                source={require("../assets/images/Pot-Diseases.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Pot Diseases</Text>
            </TouchableOpacity>
          </View>

          {/* Monitoring Section */}
          <View style={styles.monitoringSection}>
            {/* Row 1 */}
            <View style={styles.monitoringRow}>
              <View style={styles.monitoringCard}>
                <Ionicons name="thermometer-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Temp. Control</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>00</Text>
                  <Text style={styles.unitText}>°C</Text>
                </View>
              </View>

              <View style={styles.monitoringCard}>
                <Ionicons name="sunny-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Intensity</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>00</Text>
                  <Text style={styles.unitText}>Cd</Text>
                </View>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.monitoringRow}>
              <View style={styles.monitoringCard}>
                <Ionicons name="water-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Humidity</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>00</Text>
                  <Text style={styles.unitText}>%</Text>
                </View>
              </View>

              <View style={styles.monitoringCard}>
                <Ionicons name="flask-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Water PH</Text>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>00</Text>
                  <Text style={styles.unitText}>Lux</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>User</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationIcon: {
    padding: 8,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeText: {
    fontSize: 16,
  },
  appName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a237e",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  contentContainer: {
    flex: 1,
  },
  featuresGrid: {
    padding: 16,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    width: "48%",

  },
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  monitoringSection: {
    marginTop: 8,
  },
  monitoringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monitoringCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    width: "48%",
    alignItems: "center",
  },
  monitoringLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unitText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#666",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#6da77f",
    paddingTop: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#4a7a5c",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "white",
  },
});