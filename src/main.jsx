import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "@/css/global.css";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/errorBoundary";
import App from "@/layout/app";
import Home from "@/views/home";
import Detail from "@/views/detail";
import Login from "@/views/login";
import Dashboard from "@/views/dashboard";
import { seedDatabase } from "@/database/seeders";
import { migrateToFirestore, checkFirestoreData } from "@/database/migrate";

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

// Initialize app
const rootElement = document.getElementById("root");
let appRoot = null;

function renderApp(content) {
  appRoot ??= createRoot(rootElement);
  appRoot.render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>{content}</AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

async function initApp() {
  // Seed IndexedDB
  try {
    await seedDatabase();
    console.log("✅ IndexedDB seeded");
  } catch (error) {
    console.error("❌ IndexedDB seed gagal:", error);
  }

  // Check if Firestore has data
  try {
    const hasFirestoreData = await checkFirestoreData();

    if (!hasFirestoreData) {
      // Migrate from IndexedDB to Firestore
      const result = await migrateToFirestore();
      if (result.success) {
        console.log("✅ Migration completed");
      } else {
        console.error("❌ Migration failed:", result.message);
      }
    } else {
      console.log("✅ Firestore already has data, skipping migration");
    }
  } catch (error) {
    // Jaringan / Firestore tidak tersedia saat boot. Aplikasi tetap dirender,
    // error jaringan ditampilkan lewat ErrorBoundary.
    console.error("❌ Bootstrap Firestore gagal:", error);
  }

  // Render app
  renderApp(<RouterProvider router={router} />);
}

initApp().catch((error) => {
  // Gagal total sebelum sempat render - tampilkan lewat boundary yang sama.
  console.error("❌ Fatal error saat boot aplikasi:", error);
  if (appRoot) return;
  renderApp(<ErrorBoundary error={error} />);
});
