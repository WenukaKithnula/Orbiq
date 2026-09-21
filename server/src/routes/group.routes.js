import { Router } from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { createGroup, getGroups, joinGroup } from '../controllers/group.controller.js';

const router = Router();

// Every route here requires a valid Supabase JWT

router.post('/', verifySupabaseAuth, createGroup);
router.get('/', verifySupabaseAuth, getGroups);
router.post('/join', verifySupabaseAuth, joinGroup);

export default router;
