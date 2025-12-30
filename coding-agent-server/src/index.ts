import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import router from "./routes/Task/task.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "OK"
    })
})

app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;

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