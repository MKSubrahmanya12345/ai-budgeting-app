import admin from "firebase-admin";
import "dotenv/config";

// You should place your service account JSON file path in FIREBASE_SERVICE_ACCOUNT_PATH
// Or provide the JSON string in FIREBASE_SERVICE_ACCOUNT_JSON
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

try {
  if (serviceAccountJson) {
    // 1. Prioritize direct JSON string (best for Render/Cloud)
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson))
    });
    console.log("Firebase Admin initialized via JSON string");
  } else if (serviceAccountPath) {
    // 2. Fallback to file path (local development)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    console.log("Firebase Admin initialized via path:", serviceAccountPath);
  } else {
    console.warn("Firebase Admin not initialized. Provide FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH");
  }
} catch (error) {
  console.error("Critical: Failed to initialize Firebase Admin:", error.message);
}

export default admin;
