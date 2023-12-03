import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientResponseError } from 'pocketbase';
import {
  BaseResponse,
  PocketbaseService,
  ValidationError,
  isValidationError,
} from '../../core/services/pocketbase.service';

type CreateUserBody = {
  email: string;
  password: string;
  passwordConfirm: string;
  emailOptIn: boolean;
};

export interface User extends BaseResponse {
  id: string;
  name: string;
  avatar: boolean;
  zip: string;
  country: string;
  email: string;
  emailOptIn: boolean;
  emailVisibility: boolean;
  verified: boolean;
}

type UserCreateSuccessEvent = {
  type: 'success';
  data: User;
  emailSent: boolean;
};

type UserCreateValidationErrorEvent = {
  type: 'validation-error';
  error: ValidationError;
};

type UserCreateUnknownErrorEvent = {
  type: 'unknown-error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
};

type UserCreateEvent =
  | UserCreateSuccessEvent
  | UserCreateValidationErrorEvent
  | UserCreateUnknownErrorEvent;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly pb = inject(PocketbaseService).pb;

  get isLoggedIn() {
    return this.pb.authStore.isValid;
  }

  async login({ email, password }: { email: string; password: string }) {
    return this.pb
      .collection('users')
      .authWithPassword(email, password)
      .then(() => this.router.navigate(['/home']));
  }

  async register(body: CreateUserBody): Promise<UserCreateEvent> {
    try {
      return <UserCreateSuccessEvent>{
        type: 'success',
        data: await this.pb.collection('users').create<User>(body),
        emailSent: await this.pb
          .collection('users')
          .requestVerification(body.email),
      };
    } catch (err) {
      if (!(err instanceof ClientResponseError)) {
        throw err;
      }
      return isValidationError(err.originalError.data)
        ? <UserCreateValidationErrorEvent>{
            type: 'validation-error',
            error: err.originalError.data,
          }
        : <UserCreateUnknownErrorEvent>{
            type: 'unknown-error',
            error: err.originalError.data,
          };
    }
  }

  async verifyEmail(verificationToken: string) {
    return this.pb.collection('users').confirmVerification(verificationToken);
  }

  async requestPasswordReset(email: string) {
    return this.pb.collection('users').requestPasswordReset(email);
  }

  async requestEmailChange(newEmail: string) {
    if (!this.isLoggedIn) {
      throw new Error('User is not logged in');
    }
    return this.pb.collection('users').requestEmailChange(newEmail);
  }

  logout() {
    this.pb.authStore.clear();
    this.router.navigate(['/login']);
  }
}
