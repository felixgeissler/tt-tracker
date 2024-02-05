import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldControl } from './form-field-control.directive';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent<T> implements AfterViewInit, AfterContentInit {
  elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  active = input<boolean>(false);
  label = input<string>('');

  @ContentChild(FormFieldControl, { descendants: true, static: false })
  public formFieldControl!: FormFieldControl<T>;

  public isFocused: boolean | null = null;
  get isInvalid() {
    return this.control.errorState;
  }

  get control(): FormFieldControl<T> {
    return this.formFieldControl;
  }

  set control(value) {
    this.formFieldControl = value;
  }

  ngAfterContentInit() {
    this.control.stateChanges.subscribe(() => {
      this.updateFocusState();
      this.cdr.markForCheck();
    });

    if (this.control.ngControl && this.control.ngControl.valueChanges) {
      this.control.ngControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.cdr.markForCheck());
    }
  }

  ngAfterViewInit() {
    this.updateFocusState();
    this.cdr.detectChanges();
  }

  private updateFocusState() {
    if (this.control.focused && !this.isFocused) {
      this.isFocused = true;
    } else if (
      !this.control.focused &&
      (this.isFocused || this.isFocused === null)
    ) {
      this.isFocused = false;
    }
  }
}
