import { jwtVerify, createRemoteJWKSet } from 'jose';

// Supabase signs user session tokens with an asymmetric key (ES256), rotated
// via a JWKS endpoint -- there's no shared secret to check them against.
// This fetches (and caches) the project's public signing keys instead.
const JWKS = createRemoteJWKSet(
  new URL('/auth/v1/.well-known/jwks.json', process.env.SUPABASE_URL)
);

// Runs on every protected route. Confirms the request really came from a
// logged-in Supabase user, and attaches their auth ID to req.authId so
// downstream route handlers know who's asking.
export async function verifySupabaseAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
    });
    req.authId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
