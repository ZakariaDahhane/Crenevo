import {Router} from 'express';
import homepageController from '../controllers/homepage-controller.js';

const homepageRouter = Router();   

homepageRouter.get('/', homepageController.homepage);

export default homepageRouter;