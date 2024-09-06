import { Router } from 'express';
import auth from './auth';
import collab from './collab';
import notification from './notification';

const router: Router = Router();
router.use('/auth', auth);
router.use('/collab', collab);
router.use('/notification', notification);

export default router;
