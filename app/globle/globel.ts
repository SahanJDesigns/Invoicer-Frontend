import { Bill, Shop } from '@/types/types';
import { create } from 'zustand';

const useStore = create<{
    bills: Bill[];
    shops: Shop[];
    setBills: (bills: Bill[]) => void;
    setShops: (shops: Shop[]) => void;
    addBill: (bill: Bill) => void;
    addShop: (shop: Shop) => void;
}>((set) => ({
    bills: [],
    shops: [],
    setBills: (bills) => set({ bills }),
    setShops: (shops) => set({ shops }),
    addBill: (bill) => set((state) => ({ bills: [ bill, ...state.bills] })),
    addShop: (shop) => set((state) => ({ shops: [ shop, ...state.shops] })),
}));

export default useStore;
