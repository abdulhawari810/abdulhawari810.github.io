import { db } from "./db";

// ==================== PROJECT QUERIES ====================

export async function getAllProjects() {
  return await db.projects.orderBy("created_at").reverse().toArray();
}

export async function getProjectById(id) {
  return await db.projects.get(Number(id));
}

export async function getProjectsByCategory(category) {
  return await db.projects.where("category").equals(category).toArray();
}

export async function createProject(projectData) {
  return await db.projects.add({
    ...projectData,
    created_at: new Date().toISOString(),
  });
}

export async function updateProject(id, projectData) {
  return await db.projects.update(Number(id), projectData);
}

export async function deleteProject(id) {
  return await db.projects.delete(Number(id));
}

// ==================== PROFILE QUERIES ====================

export async function getProfile() {
  return await db.profile.toCollection().first();
}

export async function updateProfile(profileData) {
  const profile = await db.profile.toCollection().first();
  if (profile) {
    return await db.profile.update(profile.id, profileData);
  }
  return await db.profile.add(profileData);
}

// ==================== USER QUERIES ====================

export async function getUser() {
  return await db.users.toCollection().first();
}

export async function updateUser(userData) {
  const user = await db.users.toCollection().first();
  if (user) {
    return await db.users.update(user.id, userData);
  }
  return await db.users.add(userData);
}
