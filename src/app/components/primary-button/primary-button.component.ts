import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <button
      mat-raised-button
      [color]="color"
      [disabled]="disabled || loading"
      [ngClass]="buttonClass"
      (click)="onClick.emit($event)"
      class="primary-button"
    >
      <mat-spinner
        *ngIf="loading"
        diameter="20"
        class="button-spinner"
      ></mat-spinner>
      <mat-icon *ngIf="icon && !loading" class="button-icon">{{
        icon
      }}</mat-icon>

      <span [hidden]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styleUrls: ['./primary-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent {
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() buttonClass: string = '';
  @Output() onClick = new EventEmitter<Event>();
}
