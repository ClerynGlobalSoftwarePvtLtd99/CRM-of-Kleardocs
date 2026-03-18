import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173 || http://localhost:5000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// Routes
app.get("/", (req, res) => {
    res.send("Server is healthy");
});

export default app;