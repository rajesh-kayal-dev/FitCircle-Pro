import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Intro } from "../pages/auth/Intro";
import { SocialFeed } from "../pages/app/SocialFeed";
import { WorkoutList } from "../pages/app/WorkoutList";
import { WorkoutExecution } from "../pages/app/WorkoutExecution";
import { Profile } from "../pages/app/Profile";
import { Search } from "../pages/app/Search";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Intro />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Navigate to="/app/feed" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    children: [
      {
        path: "feed",
        element: (
          <ProtectedRoute>
            <SocialFeed />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts",
        element: (
          <ProtectedRoute>
            <WorkoutList />
          </ProtectedRoute>
        ),
      },
      {
        path: "execution",
        element: (
          <ProtectedRoute>
            <WorkoutExecution />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
