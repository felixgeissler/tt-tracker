import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/features/auth/auth.service';
import { IconComponent } from 'src/app/features/ui/icon/icon.component';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './landing-layout.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingLayoutComponent {
  public viewportService = inject(ViewportService);
  public authService = inject(AuthService);
}
