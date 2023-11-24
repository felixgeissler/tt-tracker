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

  logout() {
    this.pb.authStore.clear();
    this.router.navigate(['/login']);
  }
}
