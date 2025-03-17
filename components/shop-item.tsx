import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { MapPin } from "lucide-react-native"
import { Shop } from "@/types/types"

interface ShopItemProps {
  shop: Shop
  onPress: () => void
}

export default function ShopItem({ shop, onPress }: ShopItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.shopName}>{shop.shopName}</Text>
      <Text style={styles.doctorName}>{shop.doctorName}</Text>

      <View style={styles.locationContainer}>
        <MapPin size={14} color="#757575" />
        <Text style={styles.location}>{shop.location}</Text>
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
  shopName: {
    fontFamily: "JetBrainsMono-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  doctorName: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontFamily: "JetBrainsMono-Regular",
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
})

