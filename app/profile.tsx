import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useTheme } from "../app/ThemeContext"; // Import the theme hook

const API_URL = "http://20.212.249.149:5000/api";

export default function ProfileScreen() {
  // Get theme context
  const { colors, isDark } = useTheme();
  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    username: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.log("No token found, redirecting to login");
        router.replace("/(public)/login");
        return;
      }
      
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          await SecureStore.deleteItemAsync('userToken');
          router.replace("/(public)/login");
          return;
        }
        
        throw new Error(`Server error: ${response.status}`);
      }
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        console.log("Response text:", responseText.substring(0, 100) + "...");
        throw new Error("Failed to parse server response");
      }
      
      setUserData(data);
      setUpdatedName(data.fullName || "");
      setUpdatedEmail(data.email || "");
    } catch (error) {
      console.error("Error loading user data:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (errorMessage.includes('401')) {
        await SecureStore.deleteItemAsync('userToken');
        router.replace("/(public)/login");
      } else {
        Alert.alert("Error", "Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Logout",
            onPress: async () => {
              await SecureStore.deleteItemAsync('userToken');
              await SecureStore.setItemAsync('justLoggedOut', 'true');
              router.replace("/(public)/login");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const openUpdateModal = () => {
    setUpdatedName(userData.fullName || "");
    setUpdatedEmail(userData.email || "");
    setModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!updatedName.trim()) {
      Alert.alert("Invalid Name", "Name cannot be empty");
      return;
    }

    try {
      setUpdateLoading(true);
      
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/(public)/login");
        return;
      }
      
      const response = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            fullName: updatedName,
            email: updatedEmail
          })
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          await SecureStore.deleteItemAsync('userToken');
          router.replace("/(public)/login");
          return;
        }
        
        const errorText = await response.text();
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to update profile');
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          console.log("Response text:", errorText.substring(0, 100) + "...");
          throw new Error(`Server error: ${response.status}`);
        }
      }
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        console.log("Response text:", responseText.substring(0, 100) + "...");
        throw new Error("Failed to parse server response");
      }
      
      setUserData(data);
      
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      if (errorMessage.includes('Email already in use')) {
        Alert.alert("Error", "Email already in use by another account");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.primary }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={[styles.profileImageContainer, { backgroundColor: colors.cardBackground }]}>
          <Ionicons name="person-circle-outline" size={50} color={colors.text} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{userData.fullName}</Text>
          <Text style={[styles.profileEmail, { color: colors.placeholder }]}>{userData.email}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={openUpdateModal}>
          <Ionicons name="pencil" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.separator, { backgroundColor: colors.border }]} />

      <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Manage Account</Text>
      <ScrollView style={styles.menuContainer}>
        {/* Settings Option */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/settings")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>Setting</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Help & Feedback Option */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/help-feedback")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={colors.text}
            />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Feedback</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Logout Option */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]} 
          onPress={handleLogout}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>Log out</Text>
        </TouchableOpacity>

        <View style={[styles.doubleSeparator, { backgroundColor: colors.cardBackground }]} />

        <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Information</Text>

        {/* About Option */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/about")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.text}
            />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>About MYCOMENTOR</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Rate App Option */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/rate-app")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="star-outline" size={24} color={colors.text} />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Update Profile</Text>
            
            <Text style={[styles.inputLabel, { color: colors.placeholder }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                backgroundColor: colors.inputBackground,
                color: colors.inputText
              }]}
              value={updatedName}
              onChangeText={setUpdatedName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
            />
            
            <Text style={[styles.inputLabel, { color: colors.placeholder }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                backgroundColor: colors.inputBackground,
                color: colors.inputText
              }]}
              value={updatedEmail}
              onChangeText={setUpdatedEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.cardBackground }]}
                onPress={() => setModalVisible(false)}
                disabled={updateLoading}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleUpdateProfile}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer with Logo */}
      <View style={styles.footer}>
        <Image
          source={require("../assets/images/mushroom-bgprofile.png")}
          style={styles.footerImage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6da77f",
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  doubleSeparator: {
    height: 8,
    backgroundColor: "#f5f5f5",
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  menuIconContainer: {
    width: 32,
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    backgroundColor: "#7FB77E",
  },
  footerImage: {
    bottom: 95,
    width: 450,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#6da77f",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});