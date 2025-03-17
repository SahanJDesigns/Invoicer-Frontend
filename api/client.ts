import { updateBillStatus } from "@/server/controllers/billController"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://localhost:5000/api"

// Or for local development:
// const API_URL = 'http://10.0.2.2:5000/api'; // Use this for Android emulator
// const API_URL = 'http://localhost:5000/api'; // Use this for iOS simulator

// Helper function to get auth token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token")
  } catch (error) {
    console.error("Error getting token:", error)
    return null
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

// API client with methods for different endpoints
export const apiClient = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await handleResponse(response)

      // Save the token to AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem("token", data.token)
      }

      return data
    },

    register: async (userData: any) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      return handleResponse(response)
    },

    getCurrentUser: async () => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },
  },

  // Shop endpoints
  shops: {
    getAll: async () => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    getById: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    create: async (shopData: any) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      })

      return handleResponse(response)
    },

    update: async (id: string, shopData: any) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      })

      return handleResponse(response)
    },

    delete: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    search: async (query: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/shops/search?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },
  },

  // Bill endpoints
  bills: {
    getAll: async (filters = {}) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Convert filters object to query string
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value as string)
        }
      })

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
      console.log(queryString)
      const response = await fetch(`${API_URL}/bills${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    getById: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    getByInvoice: async (invoiceId: string) => {
      const token = await getToken()

      if (!token) {
      throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/byinvoice/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })

      return handleResponse(response)
    },

    getByDoctor: async (doctorName: string) => {
      const token = await getToken()

      if (!token) {
      throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/bydoctor/${doctorName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })

      return handleResponse(response)
    },

    getByShop: async (shopName: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/byshop/${shopName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    create: async (billData: any) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billData),
      })

      return handleResponse(response)
    },

    updateStatus: async (id: string, status: "Paid" | "Unpaid") => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      return handleResponse(response)
    },

    addPayment: async (id: string, amount: number, ) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${API_URL}/bills/addpayment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      console.log(response)
    },

    delete: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

   
  },

  // Product endpoints
  products: {
    getAll: async (search = "") => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const queryString = search ? `?search=${encodeURIComponent(search)}` : ""

      const response = await fetch(`${API_URL}/products${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    getById: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },

    create: async (productData: any) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      return handleResponse(response)
    },

    update: async (id: string, productData: any) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      return handleResponse(response)
    },

    delete: async (id: string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    },
  },
}

