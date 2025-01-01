import Router from 'express';
import { register, login, protectedHandler, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

<<<<<<< HEAD
const router = Router();
=======
const router = express.Router();
>>>>>>> d135bf642b49db51106fe9e16b51fd14560b8f4d

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, protectedHandler);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/users/user', authMiddleware, getCurrentUser);

export default router;