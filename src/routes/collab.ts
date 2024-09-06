import { Router } from 'express';
import { V, Validator } from '../middleware/validation';
import auth from '../middleware/auth';
import {
  getServers,
  newProject,
  getAllProjects,
  getMyProjects,
  getProject,
  applyProject,
  getMyCollabs,
  updateCollab,
  updateProject,
  getProjectById,
  getRoles,
  getInprogressMyCollabs,
  getSentMyCollabs,
  getAll,
  winnersAll
} from '../controllers/collab';

const router: Router = Router();

router.get('/get_servers', auth, getServers);
router.get('/get_projects', auth, getAllProjects);
router.get('/get_my_projects', auth, getMyProjects);
router.get('/get_project', auth, getProject);
router.get('/get_roles', auth, getRoles);
router.get('/', getAll);
router.get('/winners', winnersAll);

router.post(
  '/get_my_collabs',
  V.body(Validator.Collab.Get),
  auth,
  getMyCollabs
);
router.post(
  '/get_my_sentcollabs',
  V.body(Validator.Collab.Get),
  auth,
  getSentMyCollabs
);
router.post(
  '/get_my_inprogresscollabs',
  V.body(Validator.Collab.Get),
  auth,
  getInprogressMyCollabs
);

router.post('/update_collab', auth, updateCollab);
router.post('/get_project_byid', auth, getProjectById);

router.post(
  '/new_project',
  V.body(Validator.Collab.Project.Add),
  auth,
  newProject
);
router.post(
  '/update_project',
  V.body(Validator.Collab.Project.Add),
  auth,
  updateProject
);
router.post(
  '/apply_collab',
  V.body(Validator.Collab.Collab.Apply),
  auth,
  applyProject
);

export default router;
