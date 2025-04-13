"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { router } from "expo-router"
import { useAuth } from "@/components/auth-provider"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const { signIn } = useAuth()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = () => {
      let isValid = true

      // Reset errors
      setEmailError("")
      setPasswordError("")
  
      // Validate email
      if (!email) {
        setEmailError("Email is required")
        isValid = false
      } else if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address")
        isValid = false
      }
  
      // Validate password
      if (!password) {
        setPasswordError("Password is required")
        isValid = false
      } else if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters")
        isValid = false
      }
  
      if (isValid) {
  
        signIn(email, password)
          .then(() => {
            router.replace("/(tabs)/home")
          })
          .catch((error) => {
            Alert.alert("Login Failed", "Incorrect email or password")
          })
      }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("@/assets/vetgrow-logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    fontFamily: "JetBrainsMono-Regular",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontFamily: "JetBrainsMono-Regular",
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: "JetBrainsMono-Regular",
    color: "#2E7D32", // Green color
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2E7D32", // Green color
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    color: "#fff",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: {
    fontFamily: "JetBrainsMono-Regular",
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    fontFamily: "JetBrainsMono-Bold",
    color: "#2E7D32", // Green color
    fontSize: 14,
  },
})

