import { Router } from "express";

import {getAdmin } from '../controllers/admin.controller.js'

const router = Router();

router.get('/', (req,res) => {
    res.send("Admin routes with GET method");
});

 export default router;
 