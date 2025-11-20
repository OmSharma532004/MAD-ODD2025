const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

router.post("/", auth, async (req, res) => {
	try {
		const { amount, description, category, date, splitWith } = req.body;
		if (!amount)
			return res.status(400).json({ message: "Amount is required" });

		let splitIds = [];
		if (splitWith === "all") {
			const users = await User.find({}, "_id");
			splitIds = users.map((u) => u._id);
		} else if (Array.isArray(splitWith) && splitWith.length > 0) {
			// splitWith contains emails
			const users = await User.find({ email: { $in: splitWith } }, "_id");
			splitIds = users.map((u) => u._id);
		}

		// ensure paidBy is included
		if (!splitIds.find((id) => id.toString() === req.user.id)) {
			splitIds.push(req.user.id);
		}

		const txn = new Transaction({
			amount,
			description,
			category: category || "General",
			date: date || Date.now(),
			paidBy: req.user.id,
			splitAmong: splitIds,
		});

		await txn.save();
		res.json(txn);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

router.get("/", auth, async (req, res) => {
	try {
		const { category, sort = "date", order = "desc" } = req.query;

		// Only return transactions where current user is involved:
		// - user is the payer (paidBy)
		// - OR user is included in splitAmong
		const filter = {
			$or: [{ paidBy: req.user.id }, { splitAmong: req.user.id }],
		};
		if (category) filter.category = category;

		const sortObj = {};
		sortObj[sort === "amount" ? "amount" : "date"] =
			order === "asc" ? 1 : -1;

		const txns = await Transaction.find(filter)
			.populate("paidBy", "name email")
			.populate("splitAmong", "name email")
			.sort(sortObj)
			.limit(200);

		res.json(txns);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});
router.get("/summary", auth, async (req, res) => {
	try {
		// only include transactions that involve the current user
		const txns = await Transaction.find({
			$or: [{ paidBy: req.user.id }, { splitAmong: req.user.id }],
		})
			.populate("paidBy", "name email")
			.populate("splitAmong", "name email");

		const balances = {}; // otherUserId -> number (positive = other owes current user)

		txns.forEach((t) => {
			const participants = t.splitAmong.map((x) =>
				typeof x === "string" ? x : x._id.toString()
			);
			const share = t.amount / participants.length;
			const paidById = t.paidBy._id.toString();
			const cur = req.user.id.toString();

			// If current user paid, others owe current user
			if (paidById === cur) {
				participants.forEach((pid) => {
					if (pid === cur) return;
					balances[pid] = (balances[pid] || 0) + share;
				});
			} else if (participants.includes(cur)) {
				// someone else paid and current user is a participant -> current user owes paidBy
				// from perspective of current user, that paidBy's balance should be negative
				balances[paidById] = (balances[paidById] || 0) - share;
			}
			// otherwise current user not involved -> ignored
		});

		// only return other users with non-zero balances
		const userIds = Object.keys(balances).filter(
			(id) => balances[id] && Math.abs(balances[id]) > 0.0001
		);
		if (userIds.length === 0) return res.json([]);

		const users = await User.find({ _id: { $in: userIds } }, "name email");

		const result = users.map((u) => ({
			id: u._id,
			name: u.name,
			email: u.email,
			balance: Number((balances[u._id] || 0).toFixed(2)),
		}));

		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

module.exports = router;
