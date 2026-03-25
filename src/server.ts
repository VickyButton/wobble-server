import { AuthControllerH3 } from './controllers/implementations/AuthControllerH3';
import { UserControllerH3 } from './controllers/implementations/UserControllerH3';
import { AuthTokenProviderJwt } from './providers/implementations/AuthTokenProviderJwt';
import { DateTimeProviderSystem } from './providers/implementations/DateTimeProviderSystem';
import { IdProviderCrypto } from './providers/implementations/IdProviderCrypto';
import { PasswordProviderBcrypt } from './providers/implementations/PasswordProviderBcrypt';
import { MessageRepositoryMemory } from './repositories/implementations/MessageRepositoryMemory';
import { RoomRepositoryMemory } from './repositories/implementations/RoomRepositoryMemory';
import { UserRepositoryMemory } from './repositories/implementations/UserRepositoryMemory';
import { AuthService } from './services/AuthService';
import { MessageService } from './services/MessageService';
import { RoomService } from './services/RoomService';
import { UserService } from './services/UserService';
import { useConfig } from './utils/useConfig';
import { AuthValidatorZod } from './validators/implementations/AuthValidatorZod';
import { UserValidatorZod } from './validators/implementations/UserValidatorZod';
import { H3, serve } from 'h3';

interface Server {
  setup(): void;
  start(): void;
}

export function createServer(): Server {
  /* Repositories */
  const messageRepository = new MessageRepositoryMemory();
  const roomRepository = new RoomRepositoryMemory();
  const userRepository = new UserRepositoryMemory();

  /* Providers */
  const authTokenProvider = new AuthTokenProviderJwt();
  const dateTimeProvider = new DateTimeProviderSystem();
  const idProvider = new IdProviderCrypto();
  const passwordProvider = new PasswordProviderBcrypt();

  /* Services */
  const authService = new AuthService(authTokenProvider, passwordProvider, userRepository);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const messageService = new MessageService(idProvider, dateTimeProvider, messageRepository);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const roomService = new RoomService(idProvider, dateTimeProvider, roomRepository, messageRepository);
  const userService = new UserService(idProvider, passwordProvider, dateTimeProvider, userRepository);

  /* Validators */
  const authValidator = new AuthValidatorZod();
  const userValidator = new UserValidatorZod();

  /* Controllers */
  const authController = new AuthControllerH3(authService, authValidator);
  const userController = new UserControllerH3(userService, userValidator);
  // TODO: Implement remaining controllers

  const app = new H3();

  return {
    setup() {
      /* Auth */
      app.post('/auth', authController.authenticateUser);
      /* Users */
      app.get('/users', userController.getUsers);
      app.post('/users', userController.createUser);
      app.get('/users/:id', userController.getUserById);
      app.patch('/users/:id', userController.updateUser);
    },
    start() {
      const { serverPort } = useConfig();

      serve(app, {
        port: serverPort,
      });
    },
  };
}
