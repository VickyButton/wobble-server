import type { AuthService } from '../../services/AuthService';
import type { AuthValidator } from '../../validators/AuthValidator';
import type { AuthController } from '../AuthController';
import type { H3Event } from 'h3';
import { defineEventHandler, HTTPError, readBody } from 'h3';

const errorText = {
  AUTHENTICATION_FAILED: 'Username or password is incorrect, please try again.',
};

export class AuthControllerH3 implements AuthController<H3Event, Promise<unknown>> {
  private readonly authService: AuthService;
  private readonly authValidator: AuthValidator;

  constructor(authService: AuthService, authValidator: AuthValidator) {
    this.authService = authService;
    this.authValidator = authValidator;
  }

  public authenticateUser = defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!this.authValidator.validateAuthenticateUserOptions(body)) {
      throw new HTTPError({
        status: 400,
      });
    }

    try {
      return await this.authService.authenticateUser(body);
    } catch {
      throw new HTTPError({
        status: 401,
        statusText: errorText.AUTHENTICATION_FAILED,
      });
    }
  });
}
