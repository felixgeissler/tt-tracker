import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/features/auth/auth.service';
import { IconComponent } from 'src/app/features/ui/icon/icon.component';
import { ViewportService } from '../../services/viewport.service';

export type DividerMenuItem = {
  type: 'divider';
};

export type LinkMenuItem = {
  type: 'link';
  label: string;
  icon?: string;
  activeIcon?: string;
  routerLink: string;
};

export type ActionMenuItem = {
  type: 'action';
  label: string;
  icon?: string;
  activeIcon?: string;
  onInteraction: (value?: unknown) => void;
};

export type MenuItem = {
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
} & (DividerMenuItem | LinkMenuItem | ActionMenuItem);

const mobileSideNavAnimations = [
  trigger('mobileSideNav', [
    transition(':enter', [
      query('@mobileSideNavBackdrop', [animateChild()]),
      query('@mobileSideNavNavigation', [animateChild()]),
    ]),
    transition(':leave', [
      query('@mobileSideNavNavigation', [animateChild()]),
      query('@mobileSideNavBackdrop', [animateChild()]),
    ]),
  ]),
  trigger('mobileSideNavBackdrop', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(
        '150ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        style({ opacity: 1 })
      ),
    ]),
    transition(':leave', [
      animate(
        '150ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        style({ opacity: 0 })
      ),
    ]),
  ]),
  trigger('mobileSideNavNavigation', [
    transition(':enter', [
      style({ transform: 'translateX(320px)' }),
      animate(
        '150ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        style({ transform: 'translateX(0px)' })
      ),
    ]),
    transition(':leave', [
      animate(
        '150ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        style({ transform: 'translateX(320px)' })
      ),
    ]),
  ]),
];

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './base-layout.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mobileSideNavAnimations,
})
export class BaseLayoutComponent {
  public viewportService = inject(ViewportService);
  public authService = inject(AuthService);

  @Input() public menuItems: MenuItem[] = [];

  readonly isMobileMenuOpen = signal(false);
}
