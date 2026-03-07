import { setConfig } from './utils/useConfig';

const config = {
  secretKey: process.env.SECRET_KEY ?? '',
};

setConfig(config);

console.log('CONFIG', config);
