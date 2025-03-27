import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";

export default function LandingScreen() {
  const handleSignIn = () => {

    router.push('/login');

  };

  const handleGoogleSignIn = () => {
 
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>MYCOMENTOR</Text>
        <Text style={styles.subtitle}>Smart Mushroom Farming, Simplified.</Text>
      </View>

      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.bottomSection}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>WELCOME</Text>
          <Text style={styles.welcomeSubtext}>
            Your Journey to Successful Mushroom Cultivation{"\n"}Starts Here
          </Text>
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>SIGN IN</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("../assets/images/google-icon.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Joined us before? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
  },
  logo: {
    marginBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Roboto-black",
    marginTop: -80,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins",
  },

  bottomSection: {
    flex: 1,
    marginTop: 10,
    padding: 24,
  },
  imageStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  welcomeContainer: {
    justifyContent: "center",
    marginTop: 80,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontFamily: "Roboto-medium",
  },
  welcomeSubtext: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    lineHeight: 15,
    marginBottom: 10,
  },
  authButtons: {
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
  },
  signInText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    width: "70%",
    height: "18%",
  },
  googleIcon: {},
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 1,
  },
  signupText: {
    color: "white",
    fontSize: 14,
  },
  loginLink: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
