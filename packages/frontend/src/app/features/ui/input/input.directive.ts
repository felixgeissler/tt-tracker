import {
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  booleanAttribute,
} from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { FormFieldControl } from '../form-field/form-field-control.directive';

let nextUniqueId = 0;

@Directive({
  selector: 'input[appInput],textarea[appInput]',
  standalone: true,
  providers: [{ provide: FormFieldControl, useExisting: InputDirective }],
})
export class InputDirective
  implements FormFieldControl<string>, OnChanges, OnDestroy, DoCheck
{
  private _uid = `input-${nextUniqueId++}`;
  private _nativeElement: HTMLInputElement | HTMLTextAreaElement;
  private supportedInputTypes = new Map();

  @HostBinding('class') get hostClasses() {
    return [
      'block w-full h-11 rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
      this.errorState ? 'ring-red-400' : 'ring-gray-300',
    ].join(' ');
  }

  @HostListener('focus')
  onFocus() {
    this._focusChanged(true);
  }
  @HostListener('blur')
  onBlur() {
    this._focusChanged(false);
  }

  /**
   * Emits whenever the component state changes and should cause the parent
   * form field to update.
   */
  readonly stateChanges: Subject<void> = new Subject<void>();

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  private _disabled = false;

  private readonly _isTextarea: boolean;
  public focused = false;

  @Input()
  @HostBinding('id')
  get id(): string {
    return this._id || this._uid;
  }
  set id(value: string) {
    this._id = value;
  }
  private _id = '';

  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return (
      this._required ??
      this.ngControl?.control?.hasValidator(Validators.required) ??
      false
    );
  }
  set required(value) {
    this._required = value;
  }
  private _required: boolean | undefined;

  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea && this.supportedInputTypes.has(this._type)) {
      (this.elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }
  private _type = 'text';

  @Input()
  get value(): string {
    return this._nativeElement.value;
  }
  set value(value: string) {
    this._nativeElement.value = value;
    this.stateChanges.next();
    this.valueChange.emit(value);
  }

  @Input({ transform: booleanAttribute }) validateOnlyOnSubmit = false;

  @Output()
  public valueChange = new EventEmitter<string | null>(true);

  /** Whether the component is in an error state. */
  errorState = false;

  private _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week',
  ].filter(t => this.supportedInputTypes.has(t));

  constructor(
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private parentForm: NgForm,
    @Optional() private parentFormGroup: FormGroupDirective
  ) {
    this._nativeElement = this.elementRef.nativeElement;
    this._isTextarea = this._nativeElement instanceof HTMLTextAreaElement;
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();

      // Since the input isn't a `ControlValueAccessor`, we don't have a good way of knowing when
      // the disabled state has changed. We can't use the `ngControl.statusChanges`, because it
      // won't fire if the input is disabled with `emitEvents = false`, despite the input becoming
      // disabled.
      if (
        this.ngControl.disabled !== null &&
        this.ngControl.disabled !== this.disabled
      ) {
        this.disabled = this.ngControl.disabled;
        this.stateChanges.next();
      }
    }
  }

  updateErrorState() {
    const oldState = this.errorState;
    const parent = this.parentFormGroup || this.parentForm;
    const control = this.ngControl
      ? (this.ngControl.control as AbstractControl)
      : null;
    const newState = !!(
      control &&
      control.invalid &&
      ((control.touched && !this.validateOnlyOnSubmit) ||
        (parent && parent.submitted))
    );
    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  private _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  private _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this.elementRef.nativeElement as HTMLInputElement)
      .validity;
    return validity && validity.badInput;
  }

  get empty(): boolean {
    return (
      !this._isNeverEmpty() &&
      !this.elementRef.nativeElement.value &&
      !this._isBadInput()
    );
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this.elementRef.nativeElement.focus(options);
  }

  /** Callback for the cases where the focused state of the input changes. */
  private _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }
}
