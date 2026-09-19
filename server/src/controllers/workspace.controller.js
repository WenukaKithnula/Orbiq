import pool from '../db/pool.js';

export async function createWorkspace(req,res){
  const { authId } = req;
  const  name  = req.body.name;

  try{
    const result = await pool.query(
    `INSERT INTO workspaces (auth_id, name)
       VALUES ($1, $2)
       RETURNING *`,
    [authId ,name ]
  );
  return res.status(201).json({ workspace: result.rows[0] })
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ error: `Could not create ${name}` });
  }
}

export async function getworkspaces(req,res){
  const { authId } = req;
  try{
    const results = await pool.query(
      'SELECT * FROM workspaces WHERE auth_id = $1',
      [authId]
    );
    res.status(200).json({ workspaces: results.rows });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Could not fetch workspaces' });
  }
}

// DELETE /api/workspaces/:id
export async function deleteWorkspace(req, res) {
  const { authId } = req;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM workspaces
       WHERE id = $1 AND auth_id = $2
       RETURNING id`,
      [id, authId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not delete workspace' });
  }
}

