import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    checkLogoutStatus();
  }, []);

  const checkLogoutStatus = async () => {
    try {
      const logoutStatus = await SecureStore.getItemAsync("justLoggedOut");
      if (logoutStatus === "true") {
        setJustLoggedOut(true);

        await SecureStore.deleteItemAsync("justLoggedOut");
      }
    } catch (error) {
      console.error("Error checking logout status:", error);
    }
  };

  const handleBackPress = () => {
    if (justLoggedOut) {
      router.replace("/");
    } else {
      router.back();
    }
  };

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email or username");
      return false;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    // if (!validateInputs()) {
    //   return;
    // }

    // setIsLoading(true);

    try {
      // const apiUrl = 'http://172.20.10.2:5001/api/auth/login';

      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || 'Login failed');
      // }

      // await SecureStore.deleteItemAsync('justLoggedOut');

      // await SecureStore.setItemAsync('userToken', data.token);

      // setEmail("");
      // setPassword("");

      router.push("/home");
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Something went wrong. Please try again later.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("Invalid credentials")) {
        Alert.alert(
          "Login Failed",
          "Invalid email or password. Please try again."
        );
      } else {
        Alert.alert("Login Failed", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Background Mushroom Image */}
            <Image
              source={require("../../assets/images/mushroom-bg.png")}
              style={styles.mushroomBackground}
              resizeMode="contain"
            />

            {/* Header */}
            <View style={styles.header}>
              <Pressable onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Link href="/register" asChild>
                <Pressable style={styles.registerButton}>
                  <Text style={styles.registerText}>Register</Text>
                </Pressable>
              </Link>
            </View>

            {/* Login Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Login to your account - enjoy exclusive{"\n"}features and many
                more.
              </Text>
            </View>

            {/* Background Image and Form */}
            <View style={styles.formContainer}>
              <Image
                source={require("../../assets/images/login-bg.png")}
                style={styles.backgroundImage}
                resizeMode="stretch"
              />

              {/* Form Container with adjusted positioning */}
              <View style={styles.formContentContainer}>
                <View style={styles.formFields}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Username/Email"
                      value={email}
                      onChangeText={setEmail}
                      placeholderTextColor="#666"
                      editable={!isLoading}
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#666"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push("/(public)/reset")}
                    disabled={isLoading}
                  >
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#6da77f" />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    fontWeight: "bold",
  },
  registerButton: {
    padding: 8,
  },
  registerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    position: "relative",
    marginTop: 120,
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  formContentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 300,
  },
  formFields: {
    marginTop: 100,
    padding: 24,
    gap: 16,
  },
  inputContainer: {
    position: "relative",
    width: 300,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  mushroomBackground: {
    position: "absolute",
    top: 80,
    zIndex: 0,
    right: 240,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#ffffff",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    height: 56,
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
