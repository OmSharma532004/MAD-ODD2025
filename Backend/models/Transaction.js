const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
	amount: { type: Number, required: true },
	description: { type: String },
	category: { type: String, default: "General" },
	date: { type: Date, default: Date.now },
	paidBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
