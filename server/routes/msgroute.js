import express from 'express'
import {addmsg,getmsgs} from '../controllers/msgcontroller.js'

const router=express.Router();

router.post('/',addmsg)
router.get('/:chatid',getmsgs)

export default router;