import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SettingsScreen() {
  // State for various settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [units, setUnits] = useState("metric");

  // Handle account settings
  const handleAccountSettings = () => {
    // Navigate to account settings page (not implemented yet)
    Alert.alert("Coming Soon", "Account settings will be available in a future update.");
  };

  // Handle clear cache
  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache? This won't affect your saved data.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            // Implement cache clearing logic here
            Alert.alert("Success", "Cache cleared successfully");
          }
        }
      ]
    );
  };

  // Handle data export
  const handleExportData = () => {
    Alert.alert("Export Data", "Your data export is being prepared.");
    // Implement data export logic here
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Implement account deletion logic here
            router.push("/login");
          }
        }
      ]
    );
  };

  // Toggle units between metric and imperial
  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleAccountSettings}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6da77f" />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={darkMode ? "#6da77f" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={notifications ? "#6da77f" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Privacy & Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Location Access</Text>
            </View>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={locationAccess ? "#6da77f" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="analytics-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Analytics</Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={analyticsEnabled ? "#6da77f" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Background Data Sync</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={dataSync ? "#6da77f" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={toggleUnits}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="options-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Measurement Units</Text>
            </View>
            <View style={styles.unitsSelector}>
              <Text style={styles.unitsSelectorText}>
                {units === "metric" ? "Metric (°C, cm)" : "Imperial (°F, in)"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6da77f" style={{marginLeft: 8}} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Clear Cache</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={22} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Export Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="warning-outline" size={22} color="#d32f2f" style={styles.settingIcon} />
              <Text style={styles.dangerText}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MYCOMENTOR v1.0.0</Text>
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
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6da77f",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  unitsSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitsSelectorText: {
    fontSize: 14,
    color: "#666",
  },
  dangerSection: {
    paddingVertical: 12,
    marginTop: 12,
  },
  dangerSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#d32f2f",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dangerText: {
    fontSize: 16,
    color: "#d32f2f",
  },
  versionContainer: {
    padding: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
});