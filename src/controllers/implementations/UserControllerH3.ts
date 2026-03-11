import type { UserValidator } from '../../validators/UserValidator';
import type { UserController } from '../UserController';
import type { H3Event } from 'h3';
import { userErrors, type UserService } from '../../services/UserService';
import { defineEventHandler, getRouterParams, HTTPError, readBody } from 'h3';

const errorText = {
  USERNAME_NOT_AVAILABLE: 'Username is already taken, please choose a different one.',
  UNABLE_TO_CREATE_USER: 'Unable to create user, please try again later.',
  UNABLE_TO_UPDATE_USER: 'Unable to update user, please try again later.',
};

export class UserControllerH3 implements UserController<H3Event, Promise<unknown>> {
  private readonly userService: UserService;
  private readonly userValidator: UserValidator;

  constructor(userService: UserService, userValidator: UserValidator) {
    this.userService = userService;
    this.userValidator = userValidator;
  }

  public getUsers = defineEventHandler(async () => {
    return await this.userService.getUsers();
  });
  public getUserById = defineEventHandler(async (event) => {
    const params = getRouterParams(event);

    if (!params.id) {
      throw new HTTPError({
        status: 400,
      });
    }

    const user = await this.userService.getUserById(params.id);

    if (!user) {
      throw new HTTPError({
        status: 404,
      });
    }

    return user;
  });
  public createUser = defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!this.userValidator.validateCreateUserOptions(body)) {
      throw new HTTPError({
        status: 400,
      });
    }

    try {
      return await this.userService.createUser(body);
    } catch (err) {
      let status = 500;
      let statusText = '';

      if (err instanceof Error) {
        switch (err.message) {
          case userErrors.LIMIT_ONE_USER_PER_EMAIL:
            status = 200; // Return 200 to prevent user enumeration
            statusText = '';
            break;
          case userErrors.USERNAME_NOT_AVAILABLE:
            status = 409;
            statusText = errorText.USERNAME_NOT_AVAILABLE;
            break;
          case userErrors.UNABLE_TO_CREATE_USER:
            status = 500;
            statusText = errorText.UNABLE_TO_CREATE_USER;
            break;
        }
      }

      throw new HTTPError({
        status,
        statusText,
      });
    }
  });
  public updateUser = defineEventHandler(async (event) => {
    const params = getRouterParams(event);

    if (!params.id) {
      throw new HTTPError({
        status: 400,
      });
    }

    const body = await readBody(event);

    if (!this.userValidator.validateUpdateUserOptions(body)) {
      throw new HTTPError({
        status: 400,
      });
    }

    try {
      return await this.userService.updateUser(params.id, {
        displayName: body.displayName,
      });
    } catch (err) {
      let status = 500;
      let statusText = '';

      if (err instanceof Error) {
        switch (err.message) {
          case userErrors.UNABLE_TO_GET_USER:
            status = 200; // Return 200 to prevent user enumeration
            statusText = '';
            break;
          case userErrors.UNABLE_TO_UPDATE_USER:
            status = 500;
            statusText = errorText.UNABLE_TO_UPDATE_USER;
            break;
        }
      }

      throw new HTTPError({
        status,
        statusText,
      });
    }
  });
}
