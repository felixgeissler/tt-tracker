import { Injectable, NgZone, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concat, distinctUntilChanged, fromEvent, map, of } from 'rxjs';
import { WINDOW } from '../injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private readonly window = inject(WINDOW);
  private readonly ngZone = inject(NgZone);

  private readonly isMobileBreakpoint = 768;

  readonly isMobile = signal(true);

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      concat(of(null), fromEvent(this.window, 'resize'))
        .pipe(
          takeUntilDestroyed(),
          map(() => this.window.innerWidth < this.isMobileBreakpoint),
          distinctUntilChanged()
        )
        .subscribe({
          next: isMobile => {
            this.ngZone.run(() => {
              this.isMobile.set(isMobile);
            });
          },
        });
    });
  }
}
