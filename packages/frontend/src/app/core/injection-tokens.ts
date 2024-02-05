/* eslint-disable @typescript-eslint/naming-convention */
import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Global window object', {
  factory: () => window,
});
