"use client"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native"
import { useAuth } from "@/components/auth-provider"
import { Mail, Phone, LogOut } from "lucide-react-native"

export default function ProfileScreen() {
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => signOut(),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image source={require("@/assets/avatar-placeholder.png")} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{user?.name || "User Name"}</Text>
        <Text style={styles.role}>Employee</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Mail size={18} color="#2E7D32" />
            <Text style={styles.infoText}>{user?.email || "user@example.com"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={18} color="#2E7D32" />
            <Text style={styles.infoText}>{user?.phone || "+1 (555) 123-4567"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
  },
  role: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
  },
  infoContainer: {
    width: "100%",
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  actionsContainer: {
    marginTop: 24,
  },
  logoutButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  logoutText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
  },
})

