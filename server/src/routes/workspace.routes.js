import { Router } from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { createWorkspace, getworkspaces, deleteWorkspace } from '../controllers/workspace.controller.js';

const router = Router();

// Every route here requires a valid Supabase JWT


router.post('/', verifySupabaseAuth, createWorkspace);
router.get('/',verifySupabaseAuth,getworkspaces)
router.delete('/:id', verifySupabaseAuth, deleteWorkspace);


export default router;
