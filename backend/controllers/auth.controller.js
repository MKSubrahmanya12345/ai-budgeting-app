import User from "../models/user.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  monthlyBudget: user.monthlyBudget,
  netBalance: user.netBalance,
  cashBalance: user.cashBalance,
  savingsBalance: user.savingsBalance,
  currency: user.currency,
});

/**
 * Handle budget and currency updates.
 */
export const updateBudget = async (req, res) => {
  try {
    const { monthlyBudget, currency } = req.body;
    const updates = {};

    if (monthlyBudget !== undefined) {
      const parsedBudget = Number(monthlyBudget);
      if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
        return res.status(400).json({ message: "Monthly budget must be greater than zero" });
      }
      updates.monthlyBudget = parsedBudget;
    }

    if (currency !== undefined) {
      const normalizedCurrency = String(currency).trim().toUpperCase();
      if (!normalizedCurrency || normalizedCurrency.length > 5) {
        return res.status(400).json({ message: "Currency is invalid" });
      }
      updates.currency = normalizedCurrency;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid profile fields provided" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
