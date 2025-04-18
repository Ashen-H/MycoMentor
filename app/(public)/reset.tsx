import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";

const color = colors;

// Update with your backend URL
// If testing on physical device, use your computer's IP instead of localhost
// Example: const API_URL = "http://192.168.1.5:5001/api/password";
const API_URL = "http://10.0.2.2:5001/api/password"; // For Android Emulator

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Test connection to backend
  const testConnection = async () => {
    setLoading(true);
    try {
      // Test a simple endpoint first
      const response = await axios.get("http://10.0.2.2:5001/api/test");
      Alert.alert("Connection Success", JSON.stringify(response.data));
    } catch (err: any) {
      console.error("Connection test error:", err);
      Alert.alert(
        "Connection Error",
        `Error: ${err.message}\n\nMake sure your backend server is running and accessible.`
      );
    } finally {
      setLoading(false);
    }
  };

  const onRequestReset = async () => {
    if (!emailAddress) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to:", `${API_URL}/request-reset`);
      const response = await axios.post(`${API_URL}/request-reset`, {
        email: emailAddress,
      });
      
      console.log("Response:", response.data);
      setSuccessfulCreation(true);
      Alert.alert("Success", "Reset code sent to your email");
    } catch (err: any) {
      console.error("Request reset error:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received");
      }
      
      Alert.alert(
        "Error", 
        err.response?.data?.error || `Network error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!code || !password) {
      Alert.alert("Error", "Please enter both code and new password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reset`, {
        email: emailAddress,
        code: code,
        newPassword: password,
      });
      
      Alert.alert("Success", "Password reset successfully", [
        { 
          text: "OK", 
          onPress: () => {
            // Navigate to login screen
            // You'll need to implement this navigation based on your app structure
          } 
        }
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error", 
        err.response?.data?.error || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />
      <Spinner visible={loading} />

      {!successfulCreation ? (
        <>
          <Text style={styles.headerText}>Reset Password</Text>
          <Text style={styles.instructionText}>
            Enter your email address and we'll send you a code to reset your password
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="yourname@mail.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color.accent_high }]}
            onPress={onRequestReset}
          >
            <Text style={styles.buttonText}>Send Reset Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#666", marginTop: 20 }]}
            onPress={testConnection}
          >
            <Text style={styles.buttonText}>Test Backend Connection</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.headerText}>Enter Reset Code</Text>
          <Text style={styles.instructionText}>
            We've sent a code to {emailAddress}. Enter it below along with your new password.
          </Text>
          <TextInput
            value={code}
            placeholder="Reset code"
            onChangeText={setCode}
            style={styles.inputField}
            keyboardType="number-pad"
          />
          <TextInput
            placeholder="New password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color.accent_high }]}
            onPress={onReset}
          >
            <Text style={styles.buttonText}>Set New Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: color.primary,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  inputField: {
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    marginVertical: 8,
    borderRadius: 30,
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ForgotPassword;