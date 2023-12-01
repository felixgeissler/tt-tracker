import { Directive } from '@angular/core';
import { AbstractControlDirective, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

/** An interface which allows a control to work inside of a `FormField`. */
@Directive()
export abstract class FormFieldControl<T> {
  value!: T | null;

  readonly id!: string;
  readonly stateChanges!: Observable<void>;
  readonly ngControl!: NgControl | AbstractControlDirective | null;
  readonly required!: boolean;
  readonly disabled!: boolean;
  readonly focused!: boolean;
  readonly empty!: boolean;
  readonly errorState!: boolean;

  abstract onContainerClick(event: MouseEvent): void;
}
