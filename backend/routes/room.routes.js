/*** EXAMPLE CODE ***/
import { Router } from 'express';
import RoomController from '../controllers/room.controller.js';

const router = Router();
const roomController = new RoomController();

/**
 * POST - Access a room
 */
router.post('/access', roomController.access);

/**
 * POST - Create a new room
 */
router.post('/', roomController.create);

/**
 * GET - Get rooms with pagination and parameters
 */
router.get('/', roomController.find);

/**
 * GET - Get a room by name
 */
router.get('/:name', roomController.findOne);

/**
 * PUT - Update a room by id
 */
router.put('/:id', roomController.update);

/**
 * DELETE - Delete a room by id
 */
router.delete('/:id', roomController.delete);

export default router;
