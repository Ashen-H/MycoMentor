import React, { useState, useEffect } from "react";
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
import { useTheme } from "../app/ThemeContext";

export default function SettingsScreen() {
  // Get theme context
  const { isDark, colors, setIsDark } = useTheme();

  // State for various settings
  const [notifications, setNotifications] = useState(true);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleAccountSettings}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={isDark ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={notifications ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Privacy & Data Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Privacy & Data</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Location Access</Text>
            </View>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={locationAccess ? colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="analytics-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Analytics</Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={analyticsEnabled ? colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Background Data Sync</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: "#D3D3D3", true: "#A5D6A7" }}
              thumbColor={dataSync ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={toggleUnits}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="options-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Measurement Units</Text>
            </View>
            <View style={styles.unitsSelector}>
              <Text style={[styles.unitsSelectorText, { color: colors.placeholder }]}>
                {units === "metric" ? "Metric (°C, cm)" : "Imperial (°F, in)"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} style={{marginLeft: 8}} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Clear Cache</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={22} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Export Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={[styles.dangerSectionTitle, { color: colors.dangerText }]}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="warning-outline" size={22} color={colors.dangerText} style={styles.settingIcon} />
              <Text style={[styles.dangerText, { color: colors.dangerText }]}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.versionText }]}>MYCOMENTOR v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  },
  unitsSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitsSelectorText: {
    fontSize: 14,
  },
  dangerSection: {
    paddingVertical: 12,
    marginTop: 12,
  },
  dangerSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  },
  versionContainer: {
    padding: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
  },
});