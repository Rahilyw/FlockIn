import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase";

export async function uploadEventImage(userId: string, file: File): Promise<string> {
  const storage = getFirebaseStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `events/${userId}/${Date.now()}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  const storage = getFirebaseStorage();
  const ext = file.name.split(".").pop() ?? "jpg";
  const storageRef = ref(storage, `profiles/${userId}/avatar.${ext}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
