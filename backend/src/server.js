import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// connect DB
connectDB();

const app = express();

// --------------------
// Middlewares
// --------------------
// Lock CORS to the deployed frontend when CLIENT_URL is set;
// otherwise (local dev) allow all origins.
app.use(cors(process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : {}));
app.use(express.json());
app.use(morgan("dev"));

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);

// --------------------
// Health check route
// --------------------
app.get("/", (req, res) => {
  res.send("CRM API Running 🚀");
});

app.get("/api", (req, res) => {
  res.json({
    message: "CRM API working 🚀",
    status: "OK",
    endpoints: {
      auth: "/api/auth",
      opportunities: "/api/opportunities"
    }
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------
// Error handling (must be last)
// --------------------
app.use(notFound);
app.use(errorHandler);

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});