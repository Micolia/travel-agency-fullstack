import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, user_type }
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export default auth;
