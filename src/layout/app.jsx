import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getProfile } from "@/database/firestoreQueries";

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
    </div>
  );
}
