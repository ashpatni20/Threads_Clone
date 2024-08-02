const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const authMiddleware = require("./middlewares/authMiddleware");

const limiter = rateLimit({
	windowMs: 1000, 
	limit: 10,
	standardHeaders: 'draft-7',
	legacyHeaders: false, 
	// store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", authMiddleware, postRoutes);

module.exports = app;
