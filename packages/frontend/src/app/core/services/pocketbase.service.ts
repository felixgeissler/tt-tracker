import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/naming-convention
import PocketBase from 'pocketbase';

export type BaseResponse = {
  collectionId: string;
  collectionName: string;
  updated: string;
};

export type ValidationError = {
  code: number;
  message: string;
  data: Record<string, { code: string; message: string }>;
};

export const isValidationError = (obj: unknown): obj is ValidationError => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const validationError = obj as ValidationError;

  if (
    typeof validationError.code !== 'number' ||
    typeof validationError.message !== 'string' ||
    typeof validationError.data !== 'object' ||
    validationError.data === null
  ) {
    return false;
  }

  return Object.values(validationError.data).every(item => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.code === 'string' &&
      typeof item.message === 'string'
    );
  });
};

@Injectable({
  providedIn: 'root',
})
export class PocketbaseService {
  public readonly pb = new PocketBase();
}
