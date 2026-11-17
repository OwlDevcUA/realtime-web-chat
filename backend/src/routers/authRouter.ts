import express from 'express';
import { authController } from 'src/controllers/authController';
import { catchError } from 'src/midlwares/catchError';

export const authRouter = express.Router();

authRouter.post('/registration', catchError(authController.register));

authRouter.get(
  '/activate/:activationToken',
  catchError(authController.activate),
);
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.post('/sentEmail', catchError(authController.forgotPassword));
authRouter.post('/reset', catchError(authController.resetPassword));