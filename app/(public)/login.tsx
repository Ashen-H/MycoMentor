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
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = () => {
    // Navigate to the home screen
    router.push("/home");
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
                          source={require("../../assets//images/mushroom-bg.png")}
                          style={styles.mushroomBackground}
                          resizeMode="contain"
                        />
            {/* Header */}

            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
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
                Login to your account - enjoy exclusive{"\n"}features and many more.
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
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => router.push("/reset")}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
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
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
