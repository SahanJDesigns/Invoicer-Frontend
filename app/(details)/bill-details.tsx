"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { ArrowLeft, Cross, Trash2, X } from "lucide-react-native"
import { useAuth } from "@/components/auth-provider"
import { Bill } from "@/types/types"
import { apiClient } from "@/api/client"

export default function BillDetailsScreen() {
  const { user } = useAuth()
  const { id } = useLocalSearchParams()
  const [bill, setBill] = useState<Bill>()
  const [billStatus, setBillStatus] = useState(bill?.status)
  const [partialPayment, setPartialPayment] = useState("")


  const fetchBillDetails = async() => {
      const fetchedBill = await apiClient.bills.getById(id as string)
      setBill(fetchedBill.data)
      setBillStatus(fetchedBill.data.status)
    }
  
    useEffect(() => {
      fetchBillDetails()
    }, [id])


  const handleDelete = () => {
    Alert.alert("Delete Bill", "Are you sure you want to delete this bill?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          apiClient.bills.delete(bill?._id as string)
          router.back()
        },
        style: "destructive",
      },
    ])
  }

  const handlePartialPayment = async() => {
    const paymentAmount = parseFloat(partialPayment)

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount.")
      return
    }
    const currentPayment = bill?.currentPayment || 0 + paymentAmount
    
    if (bill?.totalAmount !== undefined && bill.totalAmount < currentPayment) {
      Alert.alert("Invalid Amount", "Payment amount exceeds the total amount.")
      return
    }
 
    await apiClient.bills.addPayment(bill?._id as string, paymentAmount)
    const fetchedBill = await apiClient.bills.getById(bill?._id as string);
    const updatedBill = fetchedBill.data
    setBill(updatedBill as Bill)

    if(bill?.totalAmount !== undefined && bill.totalAmount <= currentPayment ){
      updatedBill.status = "Paid"
      setBillStatus("Paid")
    }

    setPartialPayment("")
  }

  const haddlePaymentDelete = (paymentId:string) => {
    Alert.alert("Delete Payment", "Are you sure you want to delete this payment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async() => {
          await apiClient.bills.deletePayment(paymentId)

          const fetchedBill = await apiClient.bills.getById(bill?._id as string);
          const updatedBill = fetchedBill.data
          setBill(updatedBill as Bill)
          if(bill?.totalAmount !== undefined && bill.totalAmount > bill.currentPayment){
            updatedBill.status = "unpaid"
            setBillStatus("unpaid")
          }
        },
        style: "destructive",
      },
    ])
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={24} color="#E53935" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shop Name:</Text>
            <Text style={styles.infoValue}>{bill?.shopName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Doctor Name:</Text>
            <Text style={styles.infoValue}>{bill?.doctorName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice Number:</Text>
            <Text style={styles.infoValue}>{bill?.invoiceNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created By:</Text>
            <Text style={styles.infoValue}>{bill?.createdBy.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{bill?.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: billStatus === "Paid" ? "#C8E6C9" : "#FFCDD2" }]}>
              <Text style={[styles.statusText, { color: billStatus === "Paid" ? "#2E7D32" : "#D32F2F" }]}>
                {billStatus}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {bill?.products.map((product) => (
            <View key={product._id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${(bill?.totalAmount||0)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments</Text>
          {bill?.payments.map((payment) => (
            <View key={payment._id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>Amount: ${payment.amount.toFixed(2)}</Text>
          <Text style={styles.paymentDate}>Date: {new Date(payment.date).toDateString()}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => haddlePaymentDelete(payment._id)}>
                <X size={16} color="#E53935" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Remaining Payment</Text>
          <Text style={styles.totalAmount}>${((bill?.totalAmount||0) - (bill?.currentPayment||0)).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partial Payment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter payment amount"
            value={partialPayment}
            onChangeText={setPartialPayment}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.paymentButton} onPress={handlePartialPayment}>
            <Text style={styles.paymentButtonText}>Submit Payment</Text>
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
  deleteButton: {
    padding: 8,
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
  sectionTitle: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
  },
  infoValue: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
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
  productQuantity: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  productPrice: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 14,
    color: "#333",
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
  statusButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  }, input: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  paymentButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#fff",
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#333",
  },
  paymentDate: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
})

