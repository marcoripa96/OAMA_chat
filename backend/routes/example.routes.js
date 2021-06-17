/*** EXAMPLE CODE ***/
import { Router } from 'express';
import ExampleController from '../controllers/example.controller.js';

const router = Router();
const exampleController = new ExampleController();

// Welcome page
router.get('/welcome', exampleController.welcome);

// Create a new Example
router.post('/', exampleController.create);

// Retrieve all Examples
router.get('/', exampleController.findAll);

// Retrieve a single Example with id
router.get('/:id', exampleController.findOne);

// Update a Example with id
router.put('/:id', exampleController.update);

// Delete a Example with id
//router.delete('/:id', examples.delete);

// Create a new Example
//router.delete('/', examples.deleteAll);

export default router;
