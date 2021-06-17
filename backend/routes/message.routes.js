import { Router } from 'express';
import MessageController from '../controllers/message.controller.js';

//  {mergeParams: true}
const router = Router();
const messageController = new MessageController();

/**
 * POST - Create a new message
 */
router.post('/', messageController.create);

/**
 * PUT - Update a message by id
 */
router.put('/:id', messageController.update);

/**
 * GET - Get a message by id
 */
router.get('/:id', messageController.findOne);

/**
 * GET - Get messages (collection / room and with content + filters)
 */
router.get('/', messageController.find);

/**
 * DELETE - Delete a message by id
 */
router.delete('/:id', messageController.delete);

export default router;
