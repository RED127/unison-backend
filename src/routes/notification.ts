import { Router } from 'express';
import auth from '../middleware/auth';
import {
  getNotification,
  updateNotification,
  allupdateNotification
} from '../controllers/notification';

const router: Router = Router();

router.get('/get_notification', auth, getNotification);
router.post('/update_notification', auth, updateNotification);
router.post('/allupdate_notification', auth, allupdateNotification);

export default router;
