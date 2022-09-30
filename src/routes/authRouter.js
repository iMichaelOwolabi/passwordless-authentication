import { Router } from 'express';
import {
  createAccount,
  login,
  verifyUser,
} from '../controllers/authController.js';
import { authGuard } from '../middleware/index.js';

const authRouter = Router();

authRouter.post('/signup', createAccount);
authRouter.post('/login', login);
authRouter.get('/verify/:token', authGuard, verifyUser);

export { authRouter };
