import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Rutas
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import packagesRoutes from './routes/packages.routes.js';
import servicesRoutes from './routes/services.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import communityRoutes from './routes/community.routes.js';
import cartRoutes from './routes/cart.routes.js';

// Middlewares
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/cart', cartRoutes);

// Ruta de prueba
app.get('/', (_req, res) => {
  res.send('API de Agencia de Turismo funcionando 🚀');
});

// Middleware de manejo de errores
app.use(errorHandler);

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
