"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { router } from "expo-router"
import { ArrowLeft } from "lucide-react-native"
import { Input } from "@/components/input"
import { apiClient } from "@/api/client"
import useStore from "./globle/globel"

export default function CreateShopScreen() {
  const [shopName, setShopName] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [location, setLocation] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const {addShop} = useStore()
  const [errors, setErrors] = useState({
    shopName: "",
    doctorName: "",
    location: "",
    contactNumber: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      shopName: "",
      doctorName: "",
      location: "",
      contactNumber: "",
    }

    if (!shopName.trim()) {
      newErrors.shopName = "Shop name is required"
      isValid = false
    }

    if (!doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required"
      isValid = false
    }

    if (!location.trim()) {
      newErrors.location = "Location is required"
      isValid = false
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!/^\+?[0-9\s\-$$$$]+$/.test(contactNumber)) {
      newErrors.contactNumber = "Invalid contact number"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSaveShop = async () => {
    if (validateForm()) {
      try {
        const response =  await apiClient.shops.create({
          shopName,
          doctorName,
          location,
          contactNumber,
        })
        
        addShop(response.data)
        
        Alert.alert("Success", "Shop created successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to create shop. Please try again.")
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Shop</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Shop Name</Text>
            <Input value={shopName} onChangeText={setShopName} placeholder="Enter shop name" error={errors.shopName} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Doctor Name</Text>
            <Input
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder="Enter doctor name"
              error={errors.doctorName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <Input value={location} onChangeText={setLocation} placeholder="Enter location" error={errors.location} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number</Text>
            <Input
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter contact number"
              keyboardType="phone-pad"
              error={errors.contactNumber}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveShop}>
          <Text style={styles.saveButtonText}>Save Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 18,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  },
})

