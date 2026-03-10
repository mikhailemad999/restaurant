import { create } from 'zustand';

export interface CartItem {
    menu_item_id: number;
    name: string;
    price: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.menu_item_id === item.menu_item_id);
        if (existing) {
            return {
                items: state.items.map(i => i.menu_item_id === item.menu_item_id ? { ...i, quantity: i.quantity + 1 } : i)
            };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.menu_item_id !== id)
    })),
    clearCart: () => set({ items: [] }),
}));
