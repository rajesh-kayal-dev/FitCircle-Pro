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

/* ── Route guards (no JSX — plain JS createElement) ─────────── */

function RequireAuth(props) {
  var token = localStorage.getItem("fitcircle_token");
  if (!token) return React.createElement(Navigate, { to: "/login", replace: true });
  return props.children;
}

function RequireNoAuth(props) {
  var token = localStorage.getItem("fitcircle_token");
  if (token) return React.createElement(Navigate, { to: "/home", replace: true });
  return props.children;
}

function makeProtected(PageComponent) {
  return function ProtectedPage() {
    return React.createElement(RequireAuth, null,
      React.createElement(PageComponent)
    );
  };
}

function makeGuest(PageComponent) {
  return function GuestPage() {
    return React.createElement(RequireNoAuth, null,
      React.createElement(PageComponent)
    );
  };
}

function FallbackRedirect() {
  return React.createElement(Navigate, { to: "/", replace: true });
}

/* ── Router ─────────────────────────────────────────────────── */
export var router = createBrowserRouter([
  { path: "/",            Component: Intro },
  { path: "/login",       Component: makeGuest(Login) },
  { path: "/admin-login", Component: makeGuest(AdminLogin) },
  { path: "/onboarding",  Component: Onboarding },
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "home",        Component: makeProtected(Home) },
      { path: "search",      Component: makeProtected(Search) },
      { path: "workouts",    Component: makeProtected(Workout) },
      { path: "diet",        Component: makeProtected(Diet) },
      { path: "vibes",       Component: makeProtected(VibeZone) },
      { path: "products",      Component: makeProtected(Products) },
      { path: "profile",     Component: makeProtected(Profile) },
      { path: "settings",    Component: makeProtected(Settings) },
      { path: "user/:handle", Component: makeProtected(SocialProfile) },
      { path: "product/:slug", Component: makeProtected(ProductDetails) },
    ],
  },
  /* ── Admin (No layout) ── */
  {
    path: "/admin",
    Component: makeProtected(Admin),
  },
  /* ── Messaging (full-screen, no sidebar) ── */
  {
    path: "/messages",
    Component: makeProtected(MessagingLayout),
    children: [
      { path: "", Component: MessagesScreen },
      { path: "group/:groupId", Component: GroupChatScreen },
      { path: ":conversationId", Component: ChatScreen },
    ],
  },

  { path: "*", Component: FallbackRedirect },
]);
