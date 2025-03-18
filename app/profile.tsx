import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const userEmail = "mit.shuki23@gmail.com"; // This should come from your auth state
  const userName = "Nugroho Gagah"; // This should come from your auth state

  const handleLogout = () => {
    // Implement your logout logic here
    // Then navigate to login screen
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle-outline" size={50} color="#666" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Manage Account</Text>
      <ScrollView style={styles.menuContainer}>
        {/* Settings Option */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/settings")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </View>
          <Text style={styles.menuText}>Setting</Text>
          <Ionicons name="chevron-forward" size={24} color="#6da77f" />
        </TouchableOpacity>

        {/* Help & Feedback Option */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/help-feedback")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#333"
            />
          </View>
          <Text style={styles.menuText}>Help & Feedback</Text>
          <Ionicons name="chevron-forward" size={24} color="#6da77f" />
        </TouchableOpacity>

        {/* Logout Option */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </View>
          <Text style={styles.menuText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.doubleSeparator} />

        <Text style={styles.sectionTitle}>Information</Text>

        {/* About Option */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/about")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#333"
            />
          </View>
          <Text style={styles.menuText}>About MYCOMENTOR</Text>
          <Ionicons name="chevron-forward" size={24} color="#6da77f" />
        </TouchableOpacity>

        {/* Rate App Option */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/rate-app")}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="star-outline" size={24} color="#333" />
          </View>
          <Text style={styles.menuText}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={24} color="#6da77f" />
        </TouchableOpacity>
      </ScrollView>

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
    bottom: 120,
    width: 450,
  },
});
