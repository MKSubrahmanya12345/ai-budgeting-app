import User from "../models/user.js";

export const updateNetBalance = async (req, res) => {
    try {
        const { netBalance } = req.body;
        const updates = {};

        if (netBalance !== undefined) {
            const parsedNetBalance = Number(netBalance);
            if (!Number.isFinite(parsedNetBalance) || parsedNetBalance <= 0) {
                return res.status(400).json({ message: "Net balance must be greater than zero" });
            }

            updates.netBalance = parsedNetBalance;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid profile fields provided" });
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated", user: (user) });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
