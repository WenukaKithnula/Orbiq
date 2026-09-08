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

