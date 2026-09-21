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

// GET /api/groups
// Lists every group workspace the authenticated user belongs to.
export async function getGroups(req, res) {
  const { authId } = req;
  try {
    const result = await pool.query(
      `SELECT g.*, m.role FROM group_workspaces g
       JOIN group_workspace_members m ON m.group_workspace_id = g.id
       WHERE m.auth_id = $1`,
      [authId]
    );
    return res.status(200).json({ groups: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch groups' });
  }
}

// POST /api/groups/join
// Looks a group up by its invite code and adds the authenticated user as a member.
export async function joinGroup(req, res) {
  const { authId } = req;
  const inviteCode = req.body.inviteCode?.trim().toLowerCase();

  if (!inviteCode) {
    return res.status(400).json({ error: 'Invite code is required' });
  }

  try {
    const groupResult = await pool.query(
      'SELECT * FROM group_workspaces WHERE invite_code = $1',
      [inviteCode]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'No group found for that invite code' });
    }

    const group = groupResult.rows[0];

    await pool.query(
      `INSERT INTO group_workspace_members (group_workspace_id, auth_id, role)
       VALUES ($1, $2, 'member')
       ON CONFLICT (group_workspace_id, auth_id) DO NOTHING`,
      [group.id, authId]
    );

    return res.status(200).json({ group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not join group' });
  }
}
