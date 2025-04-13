"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from "react-native"
import { router } from "expo-router"
import { Plus, Search} from "lucide-react-native"
import BillItem from "@/components/bill-item"
import { Bill } from "@/types/types"
import { apiClient } from "@/api/client"
import useStore from "../globle/globel"


export default function HomeScreen() {
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { bills, setBills} = useStore()
  const [filteredBills, setFilteredBills] = useState<Bill[]>([])

  const fetchBills = async () => {
    const fetchedBills = await apiClient.bills.search(searchQuery)
    console.log(fetchedBills)
    setBills(fetchedBills.data)
  }

  useEffect(() => {
    fetchBills()
  }, [searchQuery])
  

  useEffect(() => {
    if (Array.isArray(bills)) {
      setFilteredBills(
        bills.filter((bill) => {
          if (statusFilter !== "All" && bill.status !== statusFilter) {
            return false
          }
          return true
        })
      )
    }
  }, [bills, statusFilter])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#757575" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.statusFilterButton, statusFilter === "All" && styles.activeFilter]}
              onPress={() => setStatusFilter("All")}
            >
              <Text style={[styles.filterText, statusFilter === "All" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusFilterButton, statusFilter === "Paid" && styles.activeFilter]}
              onPress={() => setStatusFilter("Paid")}
            >
              <Text style={[styles.filterText, statusFilter === "Paid" && styles.activeFilterText]}>Paid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusFilterButton, statusFilter === "Unpaid" && styles.activeFilter]}
              onPress={() => setStatusFilter("Unpaid")}
            >
              <Text style={[styles.filterText, statusFilter === "Unpaid" && styles.activeFilterText]}>Unpaid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {filteredBills.length > 0 ? (
        <FlatList
          data={filteredBills}
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bills found</Text>
          <Text style={styles.emptySubText}>Try adjusting your filters</Text>
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={() => router.push("/create-bill")}>
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
  welcomeText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  filterTypeText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#2E7D32",
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtons: {
    flexDirection: "row",
  },
  statusFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#2E7D32",
  },
  filterText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
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

