import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const CART_KEY = "fitcircle_cart";
const ORDERS_KEY = "fitcircle_orders";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload);
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) return state.filter((i) => i.id !== id);
      return state.map((i) => (i.id === id ? { ...i, quantity } : i));
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => {
    const p = parseFloat(String(i.price).replace(/[₹,]/g, ""));
    return s + (isNaN(p) ? 0 : p * i.quantity);
  }, 0);

  const placeOrder = (address, paymentMethod) => {
    const orderId = `FC${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      items: [...cart],
      address,
      paymentMethod,
      totalPrice,
      status: "Confirmed",
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    try {
      const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...prev]));
    } catch {}
    dispatch({ type: "CLEAR_CART" });
    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        placeOrder,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
