import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "@/lib/storage";
import { logError } from "@/lib/logger";

// ==================== AVATAR UPLOAD ====================

export async function uploadAvatar(file, userId = "main") {
  try {
    // Create storage reference
    const storageRef = ref(storage, `avatars/${userId}/${file.name}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    logError('Failed to upload avatar', error);
    throw error;
  }
}

export async function deleteAvatar(userId = "main") {
  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    await deleteObject(storageRef);
  } catch (error) {
    logError('Failed to delete avatar', error);
    throw error;
  }
}

export async function getAvatarUrl(userId = "main") {
  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    logError('Failed to get avatar URL', error);
    return null;
  }
}