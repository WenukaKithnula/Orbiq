import { Router } from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { createGroup } from '../controllers/group.controller.js';

const router = Router();

// Every route here requires a valid Supabase JWT

router.post('/', verifySupabaseAuth, createGroup);

export default router;
