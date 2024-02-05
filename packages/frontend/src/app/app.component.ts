import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  BaseLayoutComponent,
  MenuItem,
} from './core/components/base-layout/base-layout.component';
import { LandingLayoutComponent } from './core/components/landing-layout/landing-layout.component';
import { AuthService } from './features/auth/auth.service';

export type PageLayout = 'app' | 'landing';

export const isPageLayout = (value: string): value is PageLayout =>
  value === 'app' || value === 'landing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BaseLayoutComponent, LandingLayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  usePageLayout = signal<PageLayout>('landing');
  appMenuItems = signal<MenuItem[]>([
    {
      type: 'link',
      label: 'Home',
      icon: 'home',
      routerLink: '/home',
    },
    {
      type: 'divider',
      hideOnDesktop: true,
    },
    {
      type: 'action',
      label: 'Logout',
      onInteraction: () => this.authService.logout(),
      hideOnDesktop: true,
    },
  ]);

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        map(event => (event as RoutesRecognized).state.root.firstChild?.data)
      )
      .subscribe(data => {
        if (!data) {
          return;
        }
        // eslint-disable-next-line dot-notation
        const pageLayout = data['pageLayout'];
        if (!isPageLayout(pageLayout)) {
          return;
        }
        this.usePageLayout.set(pageLayout);
      });
  }
}
