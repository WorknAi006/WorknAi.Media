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

// Behind nginx: trust X-Forwarded-* for client IP / protocol
app.set("trust proxy", 1);
app.disable("x-powered-by");

// CORS_ORIGINS="https://worknai.media,https://admin.worknai.media" (empty = allow all, for local dev)
const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
    res.send("Backend Live 🚀");
});

app.get("/api", (_req, res) => {
    res.json({
        success: true,
        message: "WorknAI Backend Running 🚀",
    });
});

// Used by Docker healthcheck and the CI/CD post-deploy check
app.get("/api/health", (_req, res) => {
    res.json({ success: true, status: "ok", uptime: process.uptime() });
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

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (process.env.DISABLE_CRON !== "true") {
        startCronWorker();
    }
});

// Graceful shutdown so `docker compose up` rollouts don't drop in-flight requests
for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => {
        console.log(`${signal} received, shutting down...`);
        server.close(() => process.exit(0));
        setTimeout(() => process.exit(1), 10_000).unref();
    });
}
