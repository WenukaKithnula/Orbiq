import pool from '../db/pool.js';

// GET /api/me
// Checks whether this authenticated user already has a profile row.
// Frontend uses this right after login to decide: Complete Profile, or Dashboard.
export async function getMe(req, res) {
  const { authId } = req; // set by verifySupabaseAuth middleware

  const result = await pool.query(
    'SELECT * FROM app_user_data WHERE auth_id = $1',
    [authId]
  );

  if (result.rows.length === 0) {
    return res.json({ profileComplete: false });
  }

  return res.json({ profileComplete: true, profile: result.rows[0] });
}

// POST /api/users
// Creates the profile row after the Complete Your Profile form is submitted.
export async function createProfile(req, res) {
  const { authId } = req;
  const { fullName, username, timezone,purpose} = req.body;

  if (!fullName || !username || !purpose) {
    return res.status(400).json({ error: 'fullName and username purpose are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO app_user_data (auth_id, full_name, username, timezone ,purpose)
       VALUES ($1, $2, $3, $4 , $5)
       RETURNING *`,
      [authId, fullName, username, timezone , purpose]
    );
    return res.status(201).json({ profile: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // unique_violation (username or auth_id already exists)
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Could not create profile' });
  }
}
