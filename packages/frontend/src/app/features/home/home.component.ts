import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlayerService } from 'src/app/core/services/player.service';
import { AuthService } from '../auth/auth.service';
import { FormFieldComponent } from '../ui/form-field/form-field.component';
import { InputDirective } from '../ui/input/input.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  authService = inject(AuthService);
  playerService = inject(PlayerService);
  nonNullableFormBuilder = inject(NonNullableFormBuilder);
  cdr = inject(ChangeDetectorRef);

  newPlayerForm = this.nonNullableFormBuilder.group({
    name: '',
  });

  createPlayer() {
    this.playerService
      .create({
        name: this.newPlayerForm.get('name')?.value ?? '',
      })
      .then(() => this.newPlayerForm.reset())
      .catch(e => {
        if (e.response?.data?.name?.code === 'validation_not_unique') {
          this.newPlayerForm.get('name')?.setErrors({ notUnique: true });
          this.cdr.markForCheck();
          return;
        }
        throw e;
      });
  }
}
