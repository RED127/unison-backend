import { Router } from 'express';
import { V, Validator } from '../middleware/validation';
import { loginDiscord } from '../controllers/auth';

const router: Router = Router();

router.post('/', V.body(Validator.Users.Auth.Login), loginDiscord);

export default router;
