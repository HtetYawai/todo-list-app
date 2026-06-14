import { Router } from "express";

import {
  addCollaborator,
  getCollaborators,
  removeCollaborator,
} from "../controllers/collaboration.controller";

import { authMiddleware }
  from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  getCollaborators
);

router.post(
  "/",
  addCollaborator
);

router.delete(
  "/:id",
  removeCollaborator
);

export default router;