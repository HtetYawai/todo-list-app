import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import taskRoutes from "./routes/task.routes.js";
import collaborationRoutes from "./routes/collaboration.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
  res.send("HELLO");
});
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collaborators", collaborationRoutes);
app.use("/api/tasks", taskRoutes);
export default app;
