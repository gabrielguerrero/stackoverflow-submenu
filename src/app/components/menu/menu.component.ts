import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Item, SubItemsEvent } from './menu-item.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-menu',
  template: `
    <app-menu-item
      [item]="item"
      (showSubMenu)="showSubmenu($event)"
    ></app-menu-item>

    <ng-template let-items>
      <div class="sub-items">
        <app-menu-item
          *ngFor="let item of items"
          [item]="item"
          (click)="selected.emit(item)"
          (showSubMenu)="showSubmenu($event)"
        ></app-menu-item>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 100px;
      }
      .sub-items {
        background-color: antiquewhite;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class MenuComponent implements OnDestroy {
  subItemsOverlays = new Array<OverlayRef>();

  @Input() item: Item;
  @Output() selected = new EventEmitter<Item>();
  @ViewChild(TemplateRef) template;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  showSubmenu(event: SubItemsEvent) {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(event.element)
      .withPositions([
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
    });
    this.subItemsOverlays.push(overlayRef);
    const portal = new TemplatePortal(this.template, this.viewContainerRef, {
      $implicit: event.item.subItems,
    });
    overlayRef.attach(portal);
  }

  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.hideOverlays();
    }
  }

  hideOverlays() {
    this.subItemsOverlays.forEach((o) => o.dispose());
    this.subItemsOverlays.length = 0;
  }
  ngOnDestroy() {
    this.hideOverlays();
  }
}
