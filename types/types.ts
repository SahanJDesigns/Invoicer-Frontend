
export type Bill = {
  _id: string;
  invoiceNumber: string;
  shopName: string;
  doctorName: string;
  totalAmount: number;
  currentPayment: number;
  payments: {
      _id: string
      amount: number
      date: Date
    }[]
  status: string;
  products: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  createdBy: {
    _id: string;
    name: string;};
  date: string;
}

export type Shop = {
  _id: string;
  shopName: string;
  doctorName: string;
  location: string;
  contactNumber: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}