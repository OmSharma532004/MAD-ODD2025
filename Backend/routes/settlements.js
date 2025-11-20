const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Settlement = require("../models/Settlement");
const User = require("../models/User");

// Create settlement (record payment)
router.post("/", auth, async (req, res) => {
	try {
		const { toEmail, amount, note } = req.body;

		// basic validation
		if (!toEmail || typeof toEmail !== "string")
			return res
				.status(400)
				.json({ message: "Recipient email (toEmail) is required" });

		const parsedAmount = Number(amount);
		if (!isFinite(parsedAmount) || parsedAmount <= 0)
			return res
				.status(400)
				.json({ message: "Amount must be a positive number" });

		// case-insensitive lookup
		const toUser = await User.findOne({
			email: { $regex: `^${toEmail.trim()}$`, $options: "i" },
		});
		if (!toUser)
			return res.status(400).json({ message: "Recipient not found" });

		// prevent paying self
		if (toUser._id.toString() === req.user.id)
			return res
				.status(400)
				.json({ message: "Cannot record payment to yourself" });

		const settlement = new Settlement({
			from: req.user.id,
			to: toUser._id,
			amount: parsedAmount,
			note,
			date: Date.now(),
		});

		await settlement.save();

		// populate using a fresh query to avoid execPopulate warnings
		const populated = await Settlement.findById(settlement._id)
			.populate("from", "name email")
			.populate("to", "name email");

		return res.status(201).json(populated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Get settlements for current user (either from or to)
router.get("/", auth, async (req, res) => {
	try {
		const settlements = await Settlement.find({
			$or: [{ from: req.user.id }, { to: req.user.id }],
		})
			.populate("from", "name email")
			.populate("to", "name email")
			.sort({ date: -1 })
			.limit(200);

		res.json(settlements);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
