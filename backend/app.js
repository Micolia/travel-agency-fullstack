// app.js
/*import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import packagesRoutes from "./routes/packages.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import itineraryRoutes from "./routes/itinerary.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import communityRoutes from "./routes/community.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();
app.use(cors()); // requerido por el hito
app.use(express.json());

// Healthcheck para pruebas y monitoreo
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/packages", servicesRoutes);
app.use("/api/packages", itineraryRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/cart", cartRoutes);

export default app;*/
// server.js