const mongoose = require("mongoose");

const SettlementSchema = new mongoose.Schema({
	from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	amount: { type: Number, required: true },
	note: { type: String },
	date: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settlement", SettlementSchema);
