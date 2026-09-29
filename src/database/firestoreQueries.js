import { db } from "@/lib/firestore";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

// ==================== PROJECT QUERIES ====================

export async function getAllProjects() {
  const querySnapshot = await getDocs(collection(db, "projects"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getProjectById(id) {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function createProject(projectData) {
  const docRef = await addDoc(collection(db, "projects"), {
    ...projectData,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateProject(id, projectData) {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, projectData);
}

export async function deleteProject(id) {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}

// ==================== PROFILE QUERIES ====================

export async function getProfile() {
  const docRef = doc(db, "profile", "main");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateProfile(profileData) {
  const docRef = doc(db, "profile", "main");
  await setDoc(docRef, profileData, { merge: true });
}

// ==================== USER QUERIES ====================

export async function getUser() {
  const docRef = doc(db, "users", "main");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateUser(userData) {
  const docRef = doc(db, "users", "main");
  await setDoc(docRef, userData, { merge: true });
}
