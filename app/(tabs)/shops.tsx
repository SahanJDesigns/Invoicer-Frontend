"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from "react-native"
import { router } from "expo-router"
import { Plus, Search, X } from "lucide-react-native"
import ShopItem from "@/components/shop-item"
import { apiClient } from "@/api/client"
import { Shop } from "@/types/types"
import useStore from "../globle/globel"


export default function ShopsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const { shops, setShops} = useStore()

  const fetchShops = async () => {
    const fetchedShops = await apiClient.shops.search(searchQuery)
    setShops(fetchedShops.data)
  }
  
  useEffect(() => {
    fetchShops()
  }, [searchQuery])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <Search size={18} color="#757575" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search shops..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("")
                setShowSearch(false)
              }}
            >
              <X size={18} color="#757575" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearch(true)}>
            <Search size={20} color="#2E7D32" />
            <Text style={styles.searchButtonText}>Search shops</Text>
          </TouchableOpacity>
        )}
      </View>

      {shops.length > 0 ? (
        <FlatList
          data={shops}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ShopItem
              shop={item}
              onPress={() =>
                router.push({
                  pathname: "/(details)/shop-details",
                  params: { id: item._id },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No shops found</Text>
          <Text style={styles.emptySubText}>Try adjusting your search</Text>
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={() => router.push("/create-shop")}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#757575",
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#9E9E9E",
  },
  createButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})

