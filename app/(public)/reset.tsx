import { colors } from "@/constants/colors";
import { useSignIn } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const color = colors;

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, setActive } = useSignIn();

  const onRequestReset = async () => {
    setLoading(true);
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setLoading(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      alert("Password reset successfully");

      if (setActive) {
        await setActive({ session: result?.createdSessionId });
      }
    } catch (err: any) {
      alert(err.errors[0].message);
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
          <TextInput
            autoCapitalize="none"
            placeholder="yourname@mail.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color.accent_high }]}
            onPress={onRequestReset}
          >
            <Text style={styles.buttonText}>Send Reset Email</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={setCode}
            style={styles.inputField}
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
            <Text style={styles.buttonText}>Set new Password</Text>
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
  inputField: {
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginVertical: 5,
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

export default PwReset;
