import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking, // Add this import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";

export default function HomeScreen() {
  // Environmental data state
  // Environmental data state
  const [envData, setEnvData] = useState({
    temperature: "00",
    humidity: "00",
    intensity: "00",
    pH: "00",
    loading: true,
    error: null as string | null, // Update this type definition
  });
  // Fetch environmental data from backend
  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      try {
        // 1. Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setEnvData((prev) => ({
            ...prev,
            loading: false,
            error: "Location permission denied" as string | null,
          }));
          Alert.alert(
            "Permission Denied",
            "Please enable location services to get accurate environmental data."
          );
          return;
        }

        // 2. ADD THIS: Check if location services are enabled
        let locationEnabled = await Location.hasServicesEnabledAsync();

        if (!locationEnabled) {
          setEnvData((prev) => ({
            ...prev,
            loading: false,
            error: "Location services are disabled" as string | null,
          }));
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to get accurate environmental data.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return;
        }

        // 3. Get current location with better error handling
        setEnvData((prev) => ({ ...prev, loading: true }));
        let location;
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // Get location that's at most 5 seconds old
          });
        } catch (locationError) {
          console.error("Error getting location:", locationError);

          // 4. ADD THIS: Use default coordinates as fallback
          console.log("Using fallback location coordinates");
          const defaultLatitude = 40.7128; // New York coordinates as example
          const defaultLongitude = -74.006;

          // Continue with API call using default coordinates
          try {
            const API_URL =
              "http://your-backend-url.com/api/environmental-data";
            const response = await fetch(
              `${API_URL}?latitude=${defaultLatitude}&longitude=${defaultLongitude}&fallback=true`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch data from server");
            }

            const data = await response.json();

            setEnvData({
              temperature: data.temperature?.toString() || "00",
              humidity: data.humidity?.toString() || "00",
              intensity: data.intensity?.toString() || "00",
              pH: data.pH?.toString() || "00",
              loading: false,
              error: "Using approximate location" as string | null,
            });
          } catch (apiError) {
            setEnvData((prev) => ({
              ...prev,
              loading: false,
              error:
                apiError instanceof Error
                  ? apiError.message
                  : "An unknown error occurred",
            }));
          }
          return;
        }

        // Use actual coordinates if available
        const { latitude, longitude } = location.coords;

        // 5. Continue with your existing API call
        // Replace with your actual backend URL
        const API_URL = "http://your-backend-url.com/api/environmental-data";

        // Call your backend API
        const response = await fetch(
          `${API_URL}?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const data = await response.json();

        setEnvData({
          temperature: data.temperature?.toString() || "00",
          humidity: data.humidity?.toString() || "00",
          intensity: data.intensity?.toString() || "00",
          pH: data.pH?.toString() || "00",
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching environmental data:", error);
        setEnvData((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        }));
      }
    };

    fetchEnvironmentalData();

    // Refresh data every 15 minutes
    const intervalId = setInterval(fetchEnvironmentalData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

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
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here for tools..."
          placeholderTextColor="#666"
        />
      </View>
      {/* Main Features Grid */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.featuresGrid}>
          // Update these TouchableOpacity components in your HomeScreen.tsx
          file:
          {/* Row 1 */}
          <View style={styles.featuresRow}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/detect-mushrooms")}
            >
              <Image
                source={require("../assets/images/Detect-mushroom.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Detect Mushrooms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/predict-growth")}
            >
              <Image
                source={require("../assets/images/Predict-Growth.png")}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Predict Growth</Text>
            </TouchableOpacity>
          </View>
          {/* Row 2 */}
          <View style={styles.featuresRow}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/identify-diseases")}
            >
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
          {/* Monitoring Section */}
          <View style={styles.monitoringSection}>
            {/* Row 1 */}
            <View style={styles.monitoringRow}>
              <View style={styles.monitoringCard}>
                <Ionicons name="thermometer-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Temp. Control</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <>
                      <Text style={styles.valueText}>
                        {envData.temperature}
                      </Text>
                      <Text style={styles.unitText}>°C</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.monitoringCard}>
                <Ionicons name="sunny-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Intensity</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <>
                      <Text style={styles.valueText}>{envData.intensity}</Text>
                      <Text style={styles.unitText}>Cd</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.monitoringRow}>
              <View style={styles.monitoringCard}>
                <Ionicons name="water-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Humidity</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <>
                      <Text style={styles.valueText}>{envData.humidity}</Text>
                      <Text style={styles.unitText}>%</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.monitoringCard}>
                <Ionicons name="flask-outline" size={24} color="black" />
                <Text style={styles.monitoringLabel}>Water PH</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <>
                      <Text style={styles.valueText}>{envData.pH}</Text>
                      <Text style={styles.unitText}>pH</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      // Update this in your HomeScreen.tsx file:
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/lessons")}
        >
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>Lessons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}
        >
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
    marginTop: 100,
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
    height: 30,
    justifyContent: "center",
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
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
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
