import React, { useState } from "react";
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
import Constants from "expo-constants";


const API_BASE_URL = __DEV__ 
  ? 'http://172.20.10.2:5001' 
  : 'https://your-production-backend.com';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const validateInputs = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };


  const testBackendConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const testUrl = `${API_BASE_URL}/api/test`;
      console.log("Testing connection to:", testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Connection test result:", data);
        
        Alert.alert(
          "Connection Test", 
          "Successfully connected to the backend server!"
        );
      } else {
        Alert.alert(
          "Connection Test Failed", 
          `Server responded with status ${response.status}`
        );
      }
    } catch (error: unknown) {
      console.error("Connection test error:", error);
      
      let errorMessage = "Unknown error";
      

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {

        errorMessage = (error as { message: string }).message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      
      Alert.alert(
        "Connection Test Failed", 
        `Error: ${errorMessage}\n\nPlease check that:\n- The backend server is running\n- Your device is on the same network\n- The API URL is correct (${API_BASE_URL})`
      );
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = `${API_BASE_URL}/api/auth/register`;
      console.log("Sending registration request to:", apiUrl);
      
      const requestBody = {
        fullName,
        email,
        username,
        password,
      };
      
      console.log("Request data:", { ...requestBody, password: "******" });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("Response status:", response.status);
      

      let data;
      try {
        const textResponse = await response.text();
        console.log("Raw response:", textResponse);
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("Server response was not valid JSON");
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      Alert.alert(
        "Success",
        "Your account has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/login");
            },
          },
        ]
      );
      
    } catch (error: unknown) {
      console.error("Registration error:", error);
      

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          Alert.alert(
            "Connection Error", 
            "Unable to connect to the server. Please check your internet connection and make sure the server is running.\n\nTry using the 'Test Connection' button to diagnose connectivity issues."
          );
        } else {
       
          let errorMessage = error.message;
          
          if (errorMessage.includes('Email already exists')) {
            Alert.alert("Registration Failed", "This email is already registered. Please try a different one.");
          } else if (errorMessage.includes('Username already taken')) {
            Alert.alert("Registration Failed", "This username is already taken. Please choose a different one.");
          } else {
            Alert.alert("Registration Failed", errorMessage);
          }
        }
      } else {
      
        Alert.alert("Registration Failed", "An unknown error occurred. Please try again later.");
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
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Link href="/login" asChild>
                <Pressable style={styles.loginButton}>
                  <Text style={styles.loginText}>Login</Text>
                </Pressable>
              </Link>
            </View>

            {/* Register Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>
                Create your account - enjoy our services{"\n"}with most updated features.
              </Text>
            </View>

            {/* Background Image and Form */}
            <View style={styles.formContainer}>
              <Image
                source={require("../../assets/images/login-bg.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              />

              {/* Form Container */}
              <View style={styles.formContentContainer}>
                <View style={styles.formFields}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      value={fullName}
                      onChangeText={setFullName}
                      placeholderTextColor="#999"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>E-mail :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Choose a username"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password :</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
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
                  </View>

                  <TouchableOpacity 
                    style={[styles.registerButton, isLoading && styles.disabledButton]} 
                    onPress={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#6da77f" />
                    ) : (
                      <Text style={styles.registerButtonText}>Register</Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.googleButton, isLoading && styles.disabledButton]}
                    disabled={isLoading}
                  >
                    <Ionicons name="logo-google" size={20} color="black" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>Login with Google</Text>
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
  mushroomBackground: {
    position: "absolute",
    width: "100%",
    height: 300,
    top: 80,
    zIndex: 0,
    right: 130,
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
  },
  loginButton: {
    padding: 8,
  },
  loginText: {
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
    marginTop: 20,
    height: 700,
    width: 450,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  formContentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  formFields: {
    width:"96%",
    gap: 16,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#000",
    width: "100%",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  registerButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    height: 56, // Ensure consistent height with and without activity indicator
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    width: "100%",
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  testButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    height: 44,
    justifyContent: "center",
  },
  testButtonText: {
    color: "#555",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
});