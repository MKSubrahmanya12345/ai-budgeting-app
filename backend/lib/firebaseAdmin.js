import admin from "firebase-admin";
import "dotenv/config";

// You should place your service account JSON file path in FIREBASE_SERVICE_ACCOUNT_PATH
// Or provide the JSON string in FIREBASE_SERVICE_ACCOUNT_JSON
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccountPath) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
  console.log("Firebase Admin initialized via path:", serviceAccountPath);
} else if (serviceAccountJson) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson))
  });
  console.log("Firebase Admin initialized via JSON string");
} else {
  console.warn("Firebase Admin not initialized. Provide FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env");
}

export default admin;
