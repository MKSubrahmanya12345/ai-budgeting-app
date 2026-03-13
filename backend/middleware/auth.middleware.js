import admin from "../lib/firebaseAdmin.js";
import User from "../models/user.js";

/**
 * Middleware to verify Firebase ID Token from Authorization header.
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!admin.apps.length) {
    console.error("Firebase Admin NOT initialized.");
    return res.status(500).json({ message: "Server auth configuration missing" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Find the student in our database associated with this Firebase UID
    let user = await User.findOne({ firebaseUid: uid });
    
    // Auto-link by email if UID isn't set yet (migration path)
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    if (!user) {
      // In a "Firebase-only" setup, if they are verified by Firebase but 
      // not in our DB, we might want to auto-create them or return 404/403.
      // For now, we return 401 to force them through the /auth/firebase sync route.
      return res.status(401).json({ message: "User not synced with database" });
    }

    // Attach our MongoDB user object to the request
    req.user = { 
      id: user._id, 
      firebaseUid: uid,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    console.error("Auth Middleware (Firebase) Error:", error);
    res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default authMiddleware;
