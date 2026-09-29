import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "@/lib/storage";

// ==================== AVATAR UPLOAD ====================

export async function uploadAvatar(file, userId = "main") {
  try {
    // Create storage reference
    const storageRef = ref(storage, `avatars/${userId}/${file.name}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ Avatar uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Failed to upload avatar:", error);
    throw error;
  }
}

export async function deleteAvatar(userId = "main") {
  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    await deleteObject(storageRef);
    console.log("✅ Avatar deleted successfully");
  } catch (error) {
    console.error("❌ Failed to delete avatar:", error);
    throw error;
  }
}

export async function getAvatarUrl(userId = "main") {
  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("❌ Failed to get avatar URL:", error);
    return null;
  }
}
