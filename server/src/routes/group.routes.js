import { Router } from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { createGroup, deleteGroup, getGroups, joinGroup } from '../controllers/group.controller.js';

const router = Router();

// Every route here requires a valid Supabase JWT

router.post('/', verifySupabaseAuth, createGroup);
router.get('/', verifySupabaseAuth, getGroups);
router.post('/join', verifySupabaseAuth, joinGroup);
router.delete('/:id', verifySupabaseAuth, deleteGroup);

export default router;
