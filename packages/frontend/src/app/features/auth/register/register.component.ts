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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    InputDirective,
    FormFieldComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  registerForm = inject(FormBuilder).nonNullable.group({
    email: [''],
    password: [''],
  });

  isRegisterControlInvalid(path: string) {
    const control = this.registerForm.get(path);
    return control?.errors || this.registerForm.errors;
  }

  constructor() {
    this.registerForm.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }

  async onSubmit() {
    const { email, password } = this.registerForm.value;

    this.registerForm
      .get('email')
      ?.setValidators([Validators.required, Validators.email]);
    this.registerForm.get('password')?.setValidators([Validators.required]);
    this.registerForm.get('email')?.updateValueAndValidity();
    this.registerForm.get('password')?.updateValueAndValidity();

    if (!this.registerForm.valid || !email || !password) {
      return;
    }

    const userCreateEvent = await this.authService.register({
      email,
      password,
      passwordConfirm: password,
      emailOptIn: true,
    });

    if (userCreateEvent.type === 'validation-error') {
      // eslint-disable-next-line no-console
      return console.log('validation error');
    }
    if (userCreateEvent.type === 'unknown-error') {
      // eslint-disable-next-line no-console
      return console.log('unknown error');
    }

    if (userCreateEvent.type === 'success') {
      await this.authService.login({ email, password });
    }
  }
}
