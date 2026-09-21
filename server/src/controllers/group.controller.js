import crypto from 'crypto';
import pool from '../db/pool.js';

const INVITE_CODE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const INVITE_CODE_LENGTH = 6;

function generateInviteCode() {
  const bytes = crypto.randomBytes(INVITE_CODE_LENGTH);
  let code = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[bytes[i] % INVITE_CODE_ALPHABET.length];
  }
  return code;
}

// POST /api/groups
// Creates a group workspace and adds the creator as its first (owner) member.
export async function createGroup(req, res) {
  const { authId } = req;
  const { name, description, icon, color } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let group;
    for (let attempt = 0; attempt < 5 && !group; attempt++) {
      try {
        const result = await client.query(
          `INSERT INTO group_workspaces (owner_auth_id, name, description, icon, color, invite_code)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [authId, name.trim(), description ?? null, icon ?? null, color ?? null, generateInviteCode()]
        );
        
        group = result.rows[0];
        
      } catch (err) {
        if (err.code !== '23505') throw err; // anything but an invite_code collision is fatal
      }
    }

    if (!group) {
      throw new Error('Could not generate a unique invite code');
    }

    await client.query(
      `INSERT INTO group_workspace_members (group_workspace_id, auth_id, role)
       VALUES ($1, $2, 'owner')`,
      [group.id, authId]
    );

    await client.query('COMMIT');
    return res.status(201).json({ group });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return res.status(500).json({ error: 'Could not create group' });
  } finally {
    client.release();
  }
}
