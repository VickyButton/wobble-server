interface Config {
  serverPort: number;
  secretKey: string;
}

let config: Config | null = null;

export function setConfig(_config: Config) {
  config = _config;
}

export function useConfig() {
  if (!config) {
    throw new Error('Server configuration is not set');
  }

  return config;
}
