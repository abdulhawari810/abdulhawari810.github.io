import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "@/css/global.css";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import App from "@/layout/app";
import Home from "@/views/home";
import Detail from "@/views/detail";
import Login from "@/views/login";
import Dashboard from "@/views/dashboard";
import { seedDatabase } from "@/database/seeders";

import { Toaster } from "sonner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-secondary-text">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "detail/:id",
        element: <Detail />,
      },
    ],
  },
]);

// Seed database before rendering
seedDatabase()
  .then(() => {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "bg-background text-foreground border border-border-custom",
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border-custom)",
              },
            }}
          />
          <RouterProvider router={router} />
        </AuthProvider>
      </StrictMode>,
    );
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    // Still render the app even if seeding fails
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "bg-background! text-foreground border border-border-custom",
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border-custom)",
              },
            }}
          />
          <RouterProvider router={router} />
        </AuthProvider>
      </StrictMode>,
    );
  });
