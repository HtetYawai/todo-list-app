import { Router } from "express";

import { getUsers }
  from "../controllers/user.controller";

import { authMiddleware }
  from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getUsers);

export default router;