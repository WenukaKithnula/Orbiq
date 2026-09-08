import pool from '../db/pool.js';

export async function createWorkspace(req,res){
  const { authId } = req;
  const{name} = req.body.name

  try{

    const result = await pool.query(
    `INSERT INTO workspaces (auth_id, name)
       VALUES ($1, $2)
       RETURNING *`,
    [authId ,name ]
    
  );
  return res.status(201).json({message:result.rows[0]})


  }
  catch(err){
    return res.status(500).json({ error: `Could not create ${name}` });
  }
}