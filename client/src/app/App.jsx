import React from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/index.css";
import { router } from "./routes";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { MessagingProvider } from "../context/MessagingContext";
import { MusicProvider } from "../context/MusicContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <GoogleOAuthProvider clientId="772999241147-gmq49madfi2ic0gmdppm4brubllo633j.apps.googleusercontent.com">
      <AuthProvider>
        <CartProvider>
          <MessagingProvider>
            <MusicProvider>
              <QueryClientProvider client={queryClient}>
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
            </QueryClientProvider>
            </MusicProvider>
          </MessagingProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
