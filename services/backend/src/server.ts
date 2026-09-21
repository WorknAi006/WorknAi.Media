import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import schedulerRoutes from "./routes/scheduler.routes";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import heroRoutes from "./routes/hero.routes";
import leadsRoutes from "./routes/leads.routes";
import servicesRoutes from "./routes/services.routes";
import { startCronWorker } from "./worker/cron.worker";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Backend Live 🚀");
});

app.get("/api", (_req, res) => {
    res.json({
        success: true,
        message: "WorknAI Backend Running 🚀",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/blogs", postRoutes); // Blog alias per Task 6
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/users/hero", heroRoutes); // Backward compatibility alias
app.use("/api/leads", leadsRoutes);
app.use("/api/services", servicesRoutes);

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    startCronWorker();
});