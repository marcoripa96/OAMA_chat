import { Router } from 'express';
import UtilsController from '../controllers/utils.controller.js';

const router = Router();
const utilsController = new UtilsController();
/**
 * GET - Get all rooms
 */
router.get('/getLinkPreview', utilsController.getLinkPreview);

export default router;
