import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, select: false },
    firebaseUid: { type: String, unique: true, sparse: true },
    refreshTokenHash: { type: String, default: null, select: false },
    monthlyBudget: { type: Number, required: true },
    netBalance: {type: Number, default: null},
    cashBalance: {type: Number, default: null},
    savingsBalance: {type: Number, default: null},
    currency: { type: String, default: "INR" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
