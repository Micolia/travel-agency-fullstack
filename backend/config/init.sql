-- Database: agencia_db

-- DROP DATABASE IF EXISTS agencia_db;

CREATE DATABASE agencia_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es-ES'
    LC_CTYPE = 'es-ES'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


	-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'traveler' CHECK (user_type IN ('traveler','organizer','admin')),
  phone VARCHAR(20),
  date_of_birth DATE,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- PACKAGES
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  destination VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_days INT NOT NULL,
  max_participants INT NOT NULL,
  image_url VARCHAR(255),
  rating NUMERIC(3,2) DEFAULT 0,
  category VARCHAR(20) NOT NULL CHECK (category IN ('cultural','gastronomic','beach','romantic','adventure','nature')),
  start_date DATE,
  end_date DATE,
  organizer_id INT REFERENCES users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PACKAGE_SERVICES
CREATE TABLE IF NOT EXISTS package_services (
  id SERIAL PRIMARY KEY,
  package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('included','not_included','highlight'))
);

-- PACKAGE_ITINERARY
CREATE TABLE IF NOT EXISTS package_itinerary (
  id SERIAL PRIMARY KEY,
  package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_title VARCHAR(100) NOT NULL,
  activities TEXT NOT NULL
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  passengers INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','ongoing','completed','cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('credit_card','paypal','bank_transfer')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending','completed','failed','refunded')),
  transaction_id VARCHAR(100),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(100),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_review UNIQUE (booking_id)
);

-- COMMUNITY_POSTS
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  destination VARCHAR(100),
  images JSONB,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- POST_LIKES
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_like UNIQUE (user_id, post_id)
);

-- CART_ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id INT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  passengers INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_packages_search ON packages (destination, category, price);
CREATE INDEX IF NOT EXISTS idx_bookings_user_dates ON bookings (user_id, start_date, status);
CREATE INDEX IF NOT EXISTS idx_reviews_package_rating ON reviews (package_id, rating, created_at);

-- ------------------ USUARIOS ------------------
INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
VALUES 
('Administrador', 'admin@ejemplo.com', '$2b$10$EjemploHashDePassword1234567890', 'admin', '1990-01-01', '+56911111111')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
VALUES 
('Sebastian Oyarzo', 'sebastian@ejemplo.com', '$2b$10$EjemploHashDePassword1234567890', 'traveler', '1988-07-23', '+56932214061')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
VALUES 
('Nicol Pérez', 'nicol@ejemplo.com', '$2b$10$EjemploHashDePassword1234567890', 'traveler', '1990-05-10', '+56922222222')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
VALUES 
('Organizador Turismo', 'organizer@ejemplo.com', '$2b$10$EjemploHashDePassword1234567890', 'organizer', '1985-12-15', '+56933333333')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
VALUES 
('Usuario Prueba', 'testuser@ejemplo.com', '$2b$10$EjemploHashDePassword1234567890', 'traveler', '1995-03-20', '+56944444444')
ON CONFLICT (email) DO NOTHING;

-- ------------------ PAQUETES TURÍSTICOS ------------------
INSERT INTO packages (
    title, description, destination, price, duration_days, max_participants, image_url, rating, category, start_date, end_date, organizer_id, is_featured
) VALUES
('Roma Clásica', 'Descubre la ciudad eterna con nuestro tour completo', 'Roma, Italia', 299.99, 4, 20, '/src/assets/img/rome.jpg', 0.00, 'cultural', '2025-09-01', '2025-12-31', 1, FALSE),
('Costa Amalfitana', 'Relájate en la hermosa costa italiana', 'Amalfi, Italia', 599.99, 7, 15, '/src/assets/img/amalfi.jpg', 0.00, 'beach', '2025-09-01', '2025-12-31', 1, FALSE),
('Venecia Romántica', 'Un fin de semana romántico en la ciudad de los canales', 'Venezia, Italia', 349.00, 2, 20, '/src/assets/img/venice.jpg', 0.00, 'cultural', '2025-09-01', '2025-12-31', 1, FALSE),
('Sicilia Auténtica', 'Descubre los tesoros escondidos de Sicilia', 'Sicilia, Italia', 520.00, 6, 15, '/src/assets/img/sicilia.jpg', 0.00, 'beach', '2025-09-01', '2025-12-31', 1, FALSE),
('Aventura en las Dolomitas', 'Senderismo y naturaleza en las montañas más bellas', 'Trentino, Italia', 380.00, 4, 12, '/src/assets/img/dolomiti.jpg', 0.00, 'adventure', '2025-09-01', '2025-12-31', 1, FALSE),
('Gita a Milano', 'Test descrizione', 'Milano', 298.00, 3, 15, 'https://d1bvpoagx8hqbg.cloudfront.net/originals/milano-italy-4da6d7a72988edff88100b42c937c9e6.jpg', 0.00, 'adventure', '2026-01-25', '2026-01-25', 1, FALSE),
('Patagonia', 'Una gita in Chile', 'Torres del Paine', 2500.00, 3, 19, 'https://cdn.audleytravel.com/4214/3010/79/8000816-torres-del-paine-chile.jpg', 0.00, 'adventure', '2025-08-25', '2025-08-31', 1, FALSE)
ON CONFLICT DO NOTHING;
