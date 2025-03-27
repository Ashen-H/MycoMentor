import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn, isLoaded } = useSignIn();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // Start the password reset process with Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send reset email. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          {/* Logo or icon */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/mushroom-bgprofile.png")}
              style={styles.logo}
            />
            <Text style={styles.appName}>MYCOMENTOR</Text>
          </View>

          {!emailSent ? (
            <>
              <Text style={styles.instructions}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                disabled={isLoading || !isLoaded}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle"
                size={60}
                color="#6da77f"
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}. Please check your
                inbox and follow the instructions to reset your password.
              </Text>
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.returnButtonText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a237e",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  resetButton: {
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4a7a5c",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
    lineHeight: 22,
  },
  returnButton: {
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  returnButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});