import express from 'express';
import { profileController } from '../controllers/profileController.js';
import { catchError } from 'src/midlwares/catchError.js';
import { authMiddleware } from 'src/midlwares/authMidleware.js';

export const profileRouter = express.Router();

profileRouter.post(
  '/profile/changeName',
  catchError(authMiddleware),
  catchError(profileController.nameChange),
);

profileRouter.post(
  '/profile/changePassword',
  catchError(authMiddleware),
  catchError(profileController.passwordChange),
);

profileRouter.post(
  '/profile/changeEmail',
  catchError(authMiddleware),
  catchError(profileController.requestEmailChange),
);

profileRouter.get(
  `/reset/:token`,
  catchError(authMiddleware),
  catchError(profileController.confirmEmailChange),
)
