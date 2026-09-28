import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getProfile } from "@/database/projectQueries";

export default function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const profileData = await getProfile();
      setProfile(profileData);
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer profile={profile} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-background text-foreground border border-border-custom",
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border-custom)",
          },
        }}
      />
    </div>
  );
}
