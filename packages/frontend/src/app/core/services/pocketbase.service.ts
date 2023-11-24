import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/naming-convention
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class PocketbaseService {
  public readonly pb = new PocketBase();
}
