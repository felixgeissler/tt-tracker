import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  delay,
  from,
  map,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { IconComponent } from '../../ui/icon/icon.component';
import { AuthService } from '../auth.service';

type VerifyEmailState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  verifyState = signal<VerifyEmailState>('loading');

  @Input({ required: true }) token = '';

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map(paramMap => paramMap.get('token')),
        delay(2000),
        switchMap(token => from(this.authService.verifyEmail(token ?? ''))),
        switchMap(result => {
          this.verifyState.set('success');
          return timer(1000).pipe(switchMap(() => from([result])));
        }),
        catchError(error => {
          this.verifyState.set('error');
          return timer(1000).pipe(switchMap(() => throwError(() => error)));
        }),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
  }
}
