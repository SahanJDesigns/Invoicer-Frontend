"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { ArrowLeft, MapPin, Phone, User, FileText } from "lucide-react-native"
import BillItem from "@/components/bill-item"
import { Bill } from "@/types/types"
import { apiClient } from "@/api/client"

type ShopDetails = {
  _id: string
  shopName: string
  doctorName: string
  location: string
  contactNumber: string
  bills: Bill[]
  createdBy: {
    _id: string
    name: string
  }
}
export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState("info") // "info" or "bills"
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null)
  
  const fetchShopDetails = async() => {
    const fetchedShop = await apiClient.shops.getById(id as string)
    setShopDetails(fetchedShop.data)
  }

  useEffect(() => {
    fetchShopDetails()
  }, [id])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "info" && styles.activeTab]}
          onPress={() => setActiveTab("info")}
        >
          <User size={16} color={activeTab === "info" ? "#2E7D32" : "#757575"} />
          <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "bills" && styles.activeTab]}
          onPress={() => setActiveTab("bills")}
        >
          <FileText size={16} color={activeTab === "bills" ? "#2E7D32" : "#757575"} />
          <Text style={[styles.tabText, activeTab === "bills" && styles.activeTabText]}>Bills</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "info" ? (
        <ScrollView style={styles.content}>
          <View style={styles.shopCard}>
            <Text style={styles.shopName}>{shopDetails?.shopName}</Text>

            <View style={styles.infoRow}>
              <User size={18} color="#2E7D32" />
              <Text style={styles.infoText}>{shopDetails?.doctorName}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color="#2E7D32" />
              <Text style={styles.infoText}>{shopDetails?.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <Phone size={18} color="#2E7D32" />
              <Text style={styles.infoText}>{shopDetails?.contactNumber}</Text>
            </View>
          </View>

          {shopDetails && (
            <TouchableOpacity
              style={styles.createBillButton}
              onPress={() =>
                router.push({
                  pathname: "/create-bill",
                  params: { shop: JSON.stringify({ 
                    shopId: shopDetails._id,
                    shopName: shopDetails.shopName,
                    doctorName: shopDetails.doctorName,
                   }) },
                })
              }
            >
              <Text style={styles.createBillButtonText}>Create Bill for this Shop</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.billsContainer}>
          <Text style={styles.billsTitle}>Bills for {shopDetails?.shopName}</Text>

          {shopDetails?.bills?.length ?? 0 > 0 ? (
            <FlatList
              data={shopDetails?.bills}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <BillItem
                  bill={item}
                  onPress={() =>
                    router.push({
                      pathname: "/(details)/bill-details",
                      params: { id: item._id },
                    })
                  }
                />
              )}
              contentContainerStyle={styles.billsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyBillsContainer}>
              <Text style={styles.emptyBillsText}>No bills found for this shop</Text>
              <TouchableOpacity
                style={styles.createFirstBillButton}
                onPress={() =>
                  router.push({
                    pathname: "/create-bill",
                    params: { shopId: id },
                  })
                }
              >
                <Text style={styles.createFirstBillText}>Create First Bill</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2E7D32",
  },
  tabText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#2E7D32",
    fontFamily: "JetBrainsMono-Bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  shopCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shopName: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 16,
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
  createBillButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  createBillButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  },
  billsContainer: {
    flex: 1,
    padding: 16,
  },
  billsTitle: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  billsList: {
    paddingBottom: 16,
  },
  emptyBillsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBillsText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
  },
  createFirstBillButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  createFirstBillText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 14,
    color: "#fff",
  },
})

