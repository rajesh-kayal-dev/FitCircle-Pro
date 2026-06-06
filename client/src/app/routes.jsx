import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Intro from "./Intro";
import Home from "./Home";
import Search from "./Search";
import Workout from "./Workout";
import Diet from "./Diet";
import Products from "../pages/Products";
import Profile from "./Profile";
import Admin from "./Admin";
import Settings from "./Settings";
import SocialProfile from "./SocialProfile";
import { Layout } from "./components/Layout";
import { Login } from "../pages/auth/Login";
import { Onboarding } from "../pages/auth/Onboarding";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { MessagingLayout } from "../pages/messages/MessagingLayout";
import { MessagesScreen } from "../pages/messages/MessagesScreen";
import { ChatScreen } from "../pages/messages/ChatScreen";
import { GroupChatScreen } from "../pages/messages/GroupChatScreen";
import VibeZone from "../pages/VibeZone";
import ProductDetails from "../pages/ProductDetails";

/* ── Helper: read auth state from localStorage ────────────── */
function getAuthState() {
  const token = localStorage.getItem("fitcircle_token");
  if (!token) return { token: null, user: null };
  try {
    const user = JSON.parse(localStorage.getItem("fitcircle_user") || "null");
    return { token, user };
  } catch {
    return { token, user: null };
  }
}

/* ── Route guards ───────────────────────────────────────────── */

/**
 * RequireAuth — protects dashboard pages.
 *  - No token → /login
 *  - Token but NOT onboarded → /onboarding
 *  - Token + onboarded → show page
 */
function RequireAuth({ children }) {
  const { token, user } = getAuthState();
  if (!token) return <Navigate to="/login" replace />;
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

/**
 * RequireNoAuth — guest-only pages (login, intro).
 *  - No token → show page
 *  - Token but NOT onboarded → /onboarding
 *  - Token + onboarded → /home
 */
function RequireNoAuth({ children }) {
  const { token, user } = getAuthState();
  if (!token) return children;
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/home" replace />;
}

/**
 * RequireOnboarding — only for the /onboarding page.
 *  - No token → /login (must be authenticated first)
 *  - Token + already onboarded → /home (don't show again)
 *  - Token + NOT onboarded → show onboarding
 */
function RequireOnboarding({ children }) {
  const { token, user } = getAuthState();
  if (!token) return <Navigate to="/login" replace />;
  if (user && user.isOnboarded) return <Navigate to="/home" replace />;
  return children;
}

function protected_(Component) {
  return function Protected() {
    return (
      <RequireAuth>
        <Component />
      </RequireAuth>
    );
  };
}

function guestOnly(Component) {
  return function Guest() {
    return (
      <RequireNoAuth>
        <Component />
      </RequireNoAuth>
    );
  };
}

export const router = createBrowserRouter([
  /* ── Splash ── */
  { path: "/", Component: Intro },

  /* ── Auth (guest only) ── */
  { path: "/login", Component: guestOnly(Login) },
  { path: "/admin-login", Component: guestOnly(AdminLogin) },

  /* ── Onboarding (auth required + not onboarded) ── */
  {
    path: "/onboarding",
    element: (
      <RequireOnboarding>
        <Onboarding />
      </RequireOnboarding>
    ),
  },

  /* ── Protected app shell ── */
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "home",         Component: protected_(Home) },
      { path: "search",       Component: protected_(Search) },
      { path: "workouts",     Component: protected_(Workout) },
      { path: "diet",         Component: protected_(Diet) },
      { path: "vibes",        Component: protected_(VibeZone) },
      { path: "products",     Component: protected_(Products) },
      { path: "profile",      Component: protected_(Profile) },
      { path: "settings",     Component: protected_(Settings) },
      { path: "user/:handle", Component: protected_(SocialProfile) },
      { path: "product/:slug",  Component: protected_(ProductDetails) },
    ],
  },
  
  /* ── Clean Admin Panel ── */
  {
    path: "/admin",
    Component: protected_(Admin),
  },

  /* ── Messaging (full-screen) ── */
  {
    path: "/messages",
    Component: protected_(MessagingLayout),
    children: [
      { path: "", Component: MessagesScreen },
      { path: "group/:groupId", Component: GroupChatScreen },
      { path: ":conversationId", Component: ChatScreen },
    ],
  },

  /* ── 404 fallback ── */
  { path: "*", element: <Navigate to="/" replace /> },
]);
