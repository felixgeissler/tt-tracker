import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);

  registerForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  submitted = signal(false);

  async onSubmit() {
    const { email, password } = this.registerForm.value;

    this.submitted.set(true);
    if (this.registerForm.invalid || !email || !password) {
      this.registerForm.markAllAsTouched();
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
