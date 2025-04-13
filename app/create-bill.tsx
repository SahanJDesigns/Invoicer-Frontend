"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Alert } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { ArrowLeft, Plus, Minus, X, Search } from "lucide-react-native"
import { Input } from "@/components/input"
import { apiClient } from "@/api/client"
import { Product, Shop } from "@/types/types"

export default function CreateBillScreen() {
  const { shop } = useLocalSearchParams()
  const parsedShop = shop ? (JSON.parse(shop as string)) : null

  const [products, setProducts] = useState<Product[]>([])
  
  const [selectedProducts, setSelectedProducts] = useState<(Product & { quantity: number })[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse] = await Promise.all([
          apiClient.products.search(searchQuery),
        ])
        setProducts(productsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        Alert.alert("Error", "Failed to fetch data from the server")
      }
    }
    fetchData()
  }, [searchQuery])


  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p._id === product._id)
      if (existingProduct) {
        return prevProducts.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p,
        )
      } else {
        return [...prevProducts, { ...product, quantity: 1 }]
      }
    })
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId))
  }

  const handleUpdateQuantity = (productId: string, increment: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p._id === productId) {
          const newQuantity = p.quantity + increment
          return newQuantity > 0 ? { ...p, quantity: newQuantity } : p
        }
        return p
      }),
    )
  }

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)

  const handleSaveBill = () => {
    if (!parsedShop) {
      Alert.alert("Error", "Please select a shop")
      return
    }

    if (selectedProducts.length === 0) {
      Alert.alert("Error", "Please add at least one product")
      return
    }

    const response = apiClient.bills.create({
      shopId: parsedShop.shopId,
      shopName: parsedShop.shopName,
      doctorName: parsedShop.doctorName,
      totalAmount,
      products: selectedProducts.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
        name: product.name,
        status: "Unpaid",
      })),
    })

    Alert.alert("Success", "Bill created successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Bill</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Information</Text>
              <View>
                <Text style={styles.shopName}>{parsedShop?.shopName}</Text>
                <Text style={styles.doctorName}>{parsedShop?.doctorName}</Text>
              </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowProductModal(true)}>
              <Plus size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Products</Text>
            </TouchableOpacity>
          </View>

          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <View key={product._id} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                </View>

                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(product._id, -1)}>
                    <Minus size={16} color="#2E7D32" />
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{product.quantity}</Text>

                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(product._id, 1)}>
                    <Plus size={16} color="#2E7D32" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveProduct(product._id)}>
                    <X size={16} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No products added yet</Text>
          )}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBill}>
          <Text style={styles.saveButtonText}>Save Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Product Selection Modal */}
      <Modal visible={showProductModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Products</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={18} color="#757575" style={styles.searchIcon} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productSelectItem} onPress={() => handleAddProduct(item)}>
                  <View>
                    <Text style={styles.productSelectName}>{item.name}</Text>
                    <Text style={styles.productSelectPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={styles.addProductButton} onPress={() => handleAddProduct(item)}>
                    <Plus size={16} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.doneButton} onPress={() => setShowProductModal(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#333",
  },
  shopSelector: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  shopName: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 14,
    color: "#333",
  },
  doctorName: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  placeholderText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#9E9E9E",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
  },
  productPrice: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    marginVertical: 16,
  },
  totalSection: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  },
  totalAmount: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 20,
    color: "#fff",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 18,
    color: "#333",
  },
  shopItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  shopItemName: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 14,
    color: "#333",
  },
  shopItemDoctor: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
  },
  productSelectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  productSelectName: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
  },
  productSelectPrice: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  addProductButton: {
    width: 28,
    height: 28,
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButton: {
    margin: 16,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  },
})

