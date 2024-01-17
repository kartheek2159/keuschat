import express from 'express'

import { getallusers } from '../controllers/usercontroller.js'

const router=express.Router();

router.get('/',getallusers)

export default router;