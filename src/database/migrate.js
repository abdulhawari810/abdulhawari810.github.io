import { db } from "@/lib/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getAllProjects,
  getProfile,
  getUser,
} from "./projectQueries"; // Dexie queries
import { logError, logMigration } from "@/lib/logger";

export async function migrateToFirestore() {
  logMigration('start', 'Starting migration from IndexedDB to Firestore...');

  try {
    // Check if already migrated
    const profileRef = doc(db, "profile", "main");
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      logMigration('skip', 'Data already exists in Firestore. Skipping migration.');
      return { success: true, message: "Already migrated" };
    }

    // 1. Migrate Profile
    logMigration('profile', 'Migrating profile...');
    const profile = await getProfile();
    if (profile) {
      // Handle avatar_url - if too large, use default
      let avatarUrl = profile.avatar_url || "";
      if (avatarUrl.length > 500000) {
        logMigration('profile', 'avatar_url too large, using default.png', { warning: true });
        avatarUrl = "default.png";
      }

      await setDoc(profileRef, {
        username: profile.username || "",
        full_name: profile.full_name || "",
        role: profile.role || "",
        tagline: profile.tagline || "",
        heading: profile.heading || "",
        about_heading: profile.about_heading || "",
        about: profile.about || "",
        bio: profile.bio || "",
        location: profile.location || "",
        experience_years: profile.experience_years || 0,
        total_projects: profile.total_projects || 0,
        average_rating: profile.average_rating || 0,
        email: profile.email || "",
        phone: profile.phone || "",
        avatar_url: avatarUrl,
        badge_top: profile.badge_top || "",
        badge_bottom: profile.badge_bottom || "",
      });
      logMigration('profile', 'Profile migrated', { success: true });
    } else {
      logMigration('profile', 'No profile found in IndexedDB', { warning: true });
    }

    // 2. Migrate Projects
    logMigration('projects', 'Migrating projects...');
    const projects = await getAllProjects();
    if (projects.length > 0) {
      for (const project of projects) {
        await setDoc(doc(db, "projects", String(project.id)), {
          title: project.title || "",
          subtitle: project.subtitle || "",
          year: project.year || "",
          category: project.category || "",
          color: project.color || "",
          initials: project.initials || "",
          label: project.label || "",
          description: project.description || "",
          client: project.client || "",
          role: project.role || "",
          duration: project.duration || "",
          demo_url: project.demo_url || "",
          created_at: project.created_at || new Date().toISOString(),
        });
      }
      logMigration('projects', `${projects.length} projects migrated`, { count: projects.length, success: true });
    } else {
      logMigration('projects', 'No projects found in IndexedDB', { warning: true });
    }

    // 3. Migrate Users
    logMigration('users', 'Migrating users...');
    const user = await getUser();
    if (user) {
      await setDoc(doc(db, "users", "main"), {
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        gender: user.gender || "",
        skill: user.skill || "",
        birthday: user.birthday || "",
      });
      logMigration('users', 'User migrated', { success: true });
    } else {
      logMigration('users', 'No user found in IndexedDB', { warning: true });
    }

    logMigration('complete', 'Migration completed successfully!', { success: true });
    return { success: true, message: "Migration completed" };
  } catch (error) {
    logError('Migration failed', error);
    return { success: false, message: error.message };
  }
}

export async function checkFirestoreData() {
  try {
    const profileRef = doc(db, "profile", "main");
    const profileSnap = await getDoc(profileRef);
    return profileSnap.exists();
  } catch (error) {
    logError('Error checking Firestore data', error);
    return false;
  }
}
