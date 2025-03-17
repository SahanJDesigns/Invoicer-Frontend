import { Bill } from "@/types/types"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface BillItemProps {
  bill: Bill
  onPress: () => void
}

export default function BillItem({ bill, onPress }: BillItemProps) {
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.shopName}>{bill?.shopName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: bill.status === "Paid" ? "#C8E6C9" : "#FFCDD2" }]}>
          <Text style={[styles.statusText, { color: bill.status === "Paid" ? "#2E7D32" : "#D32F2F" }]}>
            {bill.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.doctorName}>{bill.doctorName}</Text>
        <Text style={styles.amount}>${bill.totalAmount?.toFixed(2)}</Text>
      </View>

      {bill.invoiceNumber && <Text style={styles.invoiceNumber}>Invoice: {bill.invoiceNumber}</Text>}

      <View style={styles.footer}>
        <Text style={styles.createdBy}>Created by: {bill.createdBy?.name}</Text>
        <Text style={styles.date}>{bill.date}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  shopName: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
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
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  doctorName: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
  },
  amount: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#333",
  },
  invoiceNumber: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#2E7D32",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  createdBy: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
  },
  date: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
  },
})

