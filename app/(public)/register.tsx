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

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Handle registration logic here
    console.log({ fullName, email, username, password });
    // Navigate to appropriate screen after registration
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
                  </View>

                  <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.googleButton}>
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
    width: "100%",
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
});