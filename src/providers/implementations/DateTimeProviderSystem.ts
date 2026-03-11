import type { DateTimeProvider } from '../DateTimeProvider';

export class DateTimeProviderSystem implements DateTimeProvider {
  public now() {
    return Date.now();
  }
}
