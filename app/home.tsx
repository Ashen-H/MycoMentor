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
import axios from "axios";
import { useTheme } from "../app/ThemeContext";
import { useNotifications } from "../app/NotificationContext";
import NotificationComponent from "../components/NotificationComponent";

export default function HomeScreen() {
  // Get theme context
  const { colors, isDark } = useTheme();

  // Get notification context
  const { getUnreadCount, checkEnvironmentalConditions, addNotification } = useNotifications();

  // Notification panel state
  const [showNotificationPanel, setShowNotificationPanel] = useState<boolean>(false);

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
    
    // Check if welcome notification has been shown after the current login
    const checkAndShowWelcomeNotification = async () => {
      try {
        const welcomeShown = await SecureStore.getItemAsync('welcomeNotificationShown');
        
        if (!welcomeShown) {
          // Show welcome notification only if it hasn't been shown yet
          addNotification({
            type: 'success',
            title: 'Welcome to MYCOMENTOR',
            message: 'Thanks for using our app! Check out our monitoring features.',
            icon: 'leaf-outline'
          });
          
          // Mark welcome notification as shown
          await SecureStore.setItemAsync('welcomeNotificationShown', 'true');
        }
      } catch (error) {
        console.error('Error handling welcome notification:', error);
      }
    };
    
    checkAndShowWelcomeNotification();
    
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
            // Use your actual backend URL here
            const API_URL = "http://192.168.1.200:5001/api/environmental-data";
            
            // Use axios instead of fetch for better error handling
            const response = await axios.get(API_URL, {
              params: {
                latitude: defaultLatitude,
                longitude: defaultLongitude,
                fallback: true
              }
            });

            const data = response.data;

            setEnvData({
              temperature: data.temperature?.toString() || "00",
              humidity: data.humidity?.toString() || "00",
              intensity: data.intensity?.toString() || "00",
              pH: data.pH?.toString() || "00",
              loading: false,
              error: "Using approximate location" as string | null,
            });
          } catch (apiError: any) { // Type assertion for apiError
            console.error("API Error details:", apiError.response?.data || apiError.message);
            setEnvData((prev) => ({
              ...prev,
              loading: false,
              error: "Failed to fetch environmental data",
            }));
          }
          return;
        }

        const { latitude, longitude } = location.coords;

        // Use your actual backend URL here
        const API_URL = "http://192.168.1.200:5001/api/environmental-data";

        // Use axios instead of fetch
        const response = await axios.get(API_URL, {
          params: { latitude, longitude }
        });

        const data = response.data;

        setEnvData({
          temperature: data.temperature?.toString() || "00",
          humidity: data.humidity?.toString() || "00",
          intensity: data.intensity?.toString() || "00",
          pH: data.pH?.toString() || "00",
          loading: false,
          error: null,
        });

        // Check environmental conditions for notifications
        if (!data.error) {
          checkEnvironmentalConditions({
            temperature: data.temperature?.toString(),
            humidity: data.humidity?.toString(),
            intensity: data.intensity?.toString(),
            pH: data.pH?.toString()
          });
        }
      } catch (error: any) { // Type assertion for error
        console.error("Error fetching environmental data:", error);
        console.error("Error response:", error.response?.data);
        setEnvData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch environmental data",
        }));
      }
    };

    fetchEnvironmentalData();

    const intervalId = setInterval(fetchEnvironmentalData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUserData = async () => {
    try {
      // Get the authentication token
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.log("No authentication token found");
        router.replace("/(public)/login");
        return;
      }
      
      // Make a request to get user data
      const response = await fetch('http://192.168.1.200:5001/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        // If token is invalid or expired
        if (response.status === 401) {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('welcomeNotificationShown');
          router.replace("/(public)/login");
          return;
        }
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      
      // Extract the first name from the full name
      const fullName = userData.fullName || '';
      const firstName = fullName.split(' ')[0];
      
      setUserName(firstName || 'User');
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep the default user name if there's an error
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Clear the welcome notification flag when logging out
      await SecureStore.deleteItemAsync('welcomeNotificationShown');
      
      // Clear the auth token
      await SecureStore.deleteItemAsync('userToken');
      
      // Navigate to login screen
      router.replace("/(public)/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hi, {userName}!</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationIcon}
          onPress={() => setShowNotificationPanel(true)}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {getUnreadCount() > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{getUnreadCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome to </Text>
        <Text style={[styles.appName, { color: colors.primary }]}>MYCOMENTOR</Text>
      </View>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.placeholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.inputText }]}
          placeholder="Search here for tools..."
          placeholderTextColor={colors.placeholder}
        />
      </View>
      {/* Main Features Grid */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.featuresGrid}>
          {/* Row 1 */}
          <View style={styles.featuresRow}>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push("/predict-growth")}
            >
              <Image
                source={require("../assets/images/Predict-Growth.png")}
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, { color: colors.text }]}>Predict Growth</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push("/identify-diseases")}
            >
              <Image
                source={require("../assets/images/Identify-Diseases.png")}
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, { color: colors.text }]}>Identify Diseases</Text>
            </TouchableOpacity>
          </View>
          {/* Row 2 */}
          <View style={styles.featuresRow}>


            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push("/marketplace")}
            >
              <Image
                source={require("../assets/images/Market-Place.png")}
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, { color: colors.text }]}>Market Place</Text>
            </TouchableOpacity>
          </View>
          {/* Monitoring Section */}
          <View style={styles.monitoringSection}>
            {/* Row 1 */}
            <View style={styles.monitoringRow}>
              <View style={[styles.monitoringCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="thermometer-outline" size={24} color={colors.text} />
                <Text style={[styles.monitoringLabel, { color: colors.text }]}>Temp. Control</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text style={[styles.valueText, { color: colors.text }]}>
                        {envData.temperature}
                      </Text>
                      <Text style={[styles.unitText, { color: colors.placeholder }]}>°C</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={[styles.monitoringCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="sunny-outline" size={24} color={colors.text} />
                <Text style={[styles.monitoringLabel, { color: colors.text }]}>Intensity</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text style={[styles.valueText, { color: colors.text }]}>{envData.intensity}</Text>
                      <Text style={[styles.unitText, { color: colors.placeholder }]}>Cd</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.monitoringRow}>
              <View style={[styles.monitoringCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="water-outline" size={24} color={colors.text} />
                <Text style={[styles.monitoringLabel, { color: colors.text }]}>Humidity</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text style={[styles.valueText, { color: colors.text }]}>{envData.humidity}</Text>
                      <Text style={[styles.unitText, { color: colors.placeholder }]}>%</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={[styles.monitoringCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="flask-outline" size={24} color={colors.text} />
                <Text style={[styles.monitoringLabel, { color: colors.text }]}>Water PH</Text>
                <View style={styles.valueContainer}>
                  {envData.loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text style={[styles.valueText, { color: colors.text }]}>{envData.pH}</Text>
                      <Text style={[styles.unitText, { color: colors.placeholder }]}>pH</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.tabBarBackground }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color={colors.tabBarText} />
          <Text style={[styles.tabLabel, { color: colors.tabBarText }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/lessons")}
        >
          <Ionicons name="information-circle-outline" size={24} color={colors.tabBarText} />
          <Text style={[styles.tabLabel, { color: colors.tabBarText }]}>Lessons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color={colors.tabBarText} />
          <Text style={[styles.tabLabel, { color: colors.tabBarText }]}>User</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Panel */}
      <NotificationComponent 
        isVisible={showNotificationPanel} 
        onClose={() => setShowNotificationPanel(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
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
  notificationBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  tabBar: {
    flexDirection: "row",
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
  },
});