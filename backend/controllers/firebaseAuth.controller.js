import admin from "../lib/firebaseAdmin.js";
import User from "../models/user.js";

export const firebaseAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID Token is required" });
    }

    if (!admin.apps.length) {
      console.error("Firebase Admin NOT initialized. Please check your .env for FIREBASE_SERVICE_ACCOUNT_PATH");
      return res.status(500).json({ message: "Server auth configuration missing" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name: fbName } = decodedToken;
    const { name, monthlyBudget, currency } = req.body;

    let user = await User.findOne({ 
      $or: [{ firebaseUid: uid }, { email: email.toLowerCase() }] 
    });

    if (!user) {
      // Create new user
      user = await User.create({
        name: name || fbName || email.split("@")[0],
        email: email.toLowerCase(),
        firebaseUid: uid,
        monthlyBudget: monthlyBudget || 5000,
        currency: currency || "INR"
      });
    } else if (!user.firebaseUid) {
      // Link existing legacy user to Firebase
      user.firebaseUid = uid;
      await user.save();
    }

    res.status(200).json({
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        netBalance: user.netBalance,
        cashBalance: user.cashBalance,
        savingsBalance: user.savingsBalance,
        currency: user.currency
      }
    });

  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({ message: "Invalid ID Token", error: error.message });
  }
};
