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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const [userName, setUserName] = useState("User");
  const [envData, setEnvData] = useState({
    temperature: "00",
    humidity: "00",
    intensity: "00",
    pH: "00",
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
    
    const fetchEnvironmentalData = async () => {
      try {
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

        setEnvData((prev) => ({ ...prev, loading: true }));
        let location;
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
          });
        } catch (locationError) {
          console.error("Error getting location:", locationError);

          console.log("Using fallback location coordinates");
          const defaultLatitude = 6.6085;
          const defaultLongitude = 80.1429;

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

        const { latitude, longitude } = location.coords;

        const API_URL = "http://your-backend-url.com/api/environmental-data";

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

    //fetchEnvironmentalData();

    const intervalId = setInterval(fetchEnvironmentalData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUserData = async () => {
    try {

      router.replace("/(public)/login");
      // Get the authentication token
      // const token = await SecureStore.getItemAsync('userToken');
      
      // if (!token) {
      //   console.log("No authentication token found");
      //   router.replace("/(public)/login");
      //   return;
      // }
       
      // // Make a request to get user data
      // const response = await fetch(`http://172.20.10.2:5001/api/auth/me`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': token
      //   }
      // });
      
      // if (!response.ok) {
      //   // If token is invalid or expired
      //   if (response.status === 401) {
      //     await SecureStore.deleteItemAsync('userToken');
      //     router.replace("/(public)/login");
      //     return;
      //   }
      //   throw new Error('Failed to fetch user data');
      // }
      
      // const userData = await response.json();
      
      // // Extract the first name from the full name
      // const fullName = userData.fullName || '';
      // const firstName = fullName.split(' ')[0];
      
      // setUserName(firstName || 'User');
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep the default user name if there's an error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, {userName}!</Text>
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

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push("/marketplace")}
            >
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