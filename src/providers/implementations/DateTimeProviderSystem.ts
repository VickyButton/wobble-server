import type { DateTimeProvider } from '../DateTimeProvider';

export class DateTimeProviderSystem implements DateTimeProvider {
  public get now() {
    return Date.now();
  }
}
