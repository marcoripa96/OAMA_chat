/*** EXAMPLE CODE ***/
import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

/**
 * POST - Create a new user
 */
router.post('/', userController.create);

// /**
//  * GET - Get all users
//  */
// router.get('/', userController.findAll);

/**
 * GET - Check if user exists by email
 */
router.post('/exists', userController.exists);

/**
 * POST - Verify user email
 */
router.post('/verifyEmail', userController.verifyEmailPost);

// /**
//  * PUT - Update a user by id
//  */
// router.put('/:id', userController.update);

// /**
//  * DELETE - Delete a user by id
//  */
// router.delete('/:id', userController.delete);

export default router;
