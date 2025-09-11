import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-container',
  template: `
    <div class="app-container" [ngClass]="containerClass">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
  @Input() containerClass: string = '';
}
