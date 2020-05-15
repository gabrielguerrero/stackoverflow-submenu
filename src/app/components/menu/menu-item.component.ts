import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-menu-item',
  template: `
    <div #element>
      {{ item.name }}
      <span *ngIf="item?.subItems?.length" (click)="showSubItems($event)">
        &gt;
      </span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 100px;
      }
    `,
  ],
})
export class MenuItemComponent {
  @Input() item: Item;
  @Output() showSubMenu = new EventEmitter<SubItemsEvent>();
  constructor(private element: ElementRef) {}

  showSubItems(event: Event) {
    event.stopPropagation();
    this.showSubMenu.emit({ item: this.item, element: this.element });
  }
}
export interface SubItemsEvent {
  element: ElementRef;
  item: Item;
}
export interface Item {
  id: string;
  name: string;
  subItems?: Item[];
}
