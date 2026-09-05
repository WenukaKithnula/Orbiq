import { Router } from 'express';
import { verifySupabaseAuth } from '../middleware/verifySupabaseAuth.js';
import { getMe, createProfile } from '../controllers/user.controller.js';

const router = Router();

// Every route here requires a valid Supabase JWT
router.get('/me', verifySupabaseAuth, getMe);
router.post('/users', verifySupabaseAuth, createProfile);

export default router;
