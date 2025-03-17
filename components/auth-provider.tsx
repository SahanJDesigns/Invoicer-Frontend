"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiClient } from "@/api/client"

// Mock user data
const MOCK_USER = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
}

type User = {
  id: string
  name: string
  email: string
  phone: string
} | null

type AuthContextType = {
  user: User
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Error checking login status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.auth.login(email, password)
      if (response.success) {
        const user = response.data
        await AsyncStorage.setItem("user", JSON.stringify(user))
        setUser(user)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
      router.replace("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return null // Or a loading spinner
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

