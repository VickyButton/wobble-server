import { createServer } from './server';
import { setConfig } from './utils/useConfig';

const config = {
  serverPort: typeof process.env.SERVER_PORT === 'string' ? parseInt(process.env.SERVER_PORT) : 3000,
  secretKey: process.env.SECRET_KEY ?? '',
};

setConfig(config);

const server = createServer();

server.setup();
server.start();
