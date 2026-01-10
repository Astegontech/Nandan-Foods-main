import admin from "firebase-admin";
import "dotenv/config";

// You can put the generated private key json file in the server folder
// and reference it, OR put the details in .env variables.
// For now, checks for a file 'firebase-service-account.json' or env vars.

import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

let serviceAccount;

try {
  // Option 1: Env variables (safer for specific fields)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle private key newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  } else {
    // Option 2: Load from file
    const serviceAccountPath = new URL(
      "../firebase-service-account.json",
      import.meta.url
    );
    const data = await readFile(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(data);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n"
      );
    }
  }
} catch (e) {
  console.error("Error setting up Firebase Admin credentials:", e.message);
}
// Fallback: try loading service account from file if previous method failed
if (!serviceAccount) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const serviceAccountPath = path.join(
      __dirname,
      "..",
      "firebase-service-account.json"
    );
    const data = await readFile(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(data);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n"
      );
    }
  } catch (e) {
    /* fallback failed */
  }
}
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin Initialized");
}

export default admin;
