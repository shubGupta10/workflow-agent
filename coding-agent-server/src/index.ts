import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";

import taskRouter from "./routes/task/task.router";
import authRoutes from "./routes/user/user.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

// ✅ AUTH ROUTES (THIS WAS MISSING)
app.use("/api/auth", authRoutes);

// ✅ TASK ROUTES
app.use("/api/v1", taskRouter);

app.use((err: any, req: express.Request, res: express.Response) => {
  console.error("[ERROR]", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5500;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
