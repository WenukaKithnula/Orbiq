import jwt from 'jsonwebtoken';

// Runs on every protected route. Confirms the request really came from a
// logged-in Supabase user, and attaches their auth ID to req.authId so
// downstream route handlers know who's asking.
export function verifySupabaseAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.authId = payload.sub; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
