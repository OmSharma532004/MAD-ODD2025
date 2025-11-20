require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const txnRoutes = require("./routes/transactions");
const settlementsRoutes = require("./routes/settlements"); // added

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error", err));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", txnRoutes);
app.use("/api/settlements", settlementsRoutes); // added

app.get("/", (req, res) => res.send("SplitWose backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
