import React from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "../styles/index.css";
import { router } from "./routes";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { MessagingProvider } from "../context/MessagingContext";
import { MusicProvider } from "../context/MusicContext";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="772999241147-gmq49madfi2ic0gmdppm4brubllo633j.apps.googleusercontent.com">
      <AuthProvider>
        <CartProvider>
          <MessagingProvider>
            <MusicProvider>
              <Toaster
                position="top-right"
                expand={true}
                richColors
                theme="light"
                toastOptions={{
                  className:
                    "font-sans font-medium text-sm rounded-2xl border-slate-200 bg-white",
                }}
              />
              <RouterProvider router={router} />
            </MusicProvider>
          </MessagingProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
