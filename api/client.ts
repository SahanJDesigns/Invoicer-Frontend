import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "https://invoicer-backend-production.up.railway.app/api"

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
      try{
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await handleResponse(response)
      if (data.token) {
        await AsyncStorage.setItem("token", data.token)
      }
      return data
    } catch (error) {
      return null
    }
    },

    // getCurrentUser: async () => {
    //   const token = await getToken()

    //   if (!token) {
    //     throw new Error("No authentication token found")
    //   }

    //   const response = await fetch(`${API_URL}/auth/me`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })

    //   return handleResponse(response)
    // },
  },

  // Shop endpoints
  shops: {
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
    search: async (query:string) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch(`${API_URL}/bills/search?query=${encodeURIComponent(query)}`, {
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

      return handleResponse(response)
    },
    deletePayment: async (paymentId: string) => {
      const token = await getToken()
      console.log(paymentId)
      if(token){
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/bills/deletepayment/${paymentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
    search: async (search = "") => {
      const token = await getToken()

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/products/search?query=${encodeURIComponent(search)}`, {
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
  },
}
