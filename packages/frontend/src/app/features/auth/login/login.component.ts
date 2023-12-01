import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { InputDirective } from '../../ui/input/input.directive';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loginForm = inject(FormBuilder).nonNullable.group({
    email: [''],
    password: [''],
  });

  isLoginControlInvalid(path: string) {
    const control = this.loginForm.get(path);
    return control?.errors || this.loginForm.errors;
  }

  constructor() {
    this.loginForm.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.loginForm
      .get('email')
      ?.setValidators([Validators.required, Validators.email]);
    this.loginForm.get('password')?.setValidators([Validators.required]);
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('password')?.updateValueAndValidity();

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService.login({ email, password }).catch(() => {
      this.loginForm.setErrors({ invalidCredentials: true });
    });
  }
}
