import { Component } from '@angular/core';
import { Item } from './components/menu/menu-item.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="filePath">
      <ng-container *ngFor="let item of selectedPath">
        &nbsp;/&nbsp;
        <app-menu [item]="item" (selected)="selectItem($event)"></app-menu>
      </ng-container>
    </div>
    <div>Selected: {{ selectedItem?.name }}</div>
  `,
  styles: [
    `
      .filePath {
        display: flex;
      }
    `,
  ],
})
export class AppComponent {
  rootFile: Item = {
    id: 'Root',
    name: 'Root',
    subItems: [
      { id: 'Root/Level 1', name: 'Level 1' },
      {
        id: 'Root/Level 2',
        name: 'Level 2',
        subItems: [
          { id: 'Root/Level 2/Level 2.1', name: 'Level 2.1' },
          { id: 'Root/Level 2/Level 2.2', name: 'Level 2.2' },
          {
            id: 'Root/Level 2/Level 2.3',
            name: 'Level 2.3',
            subItems: [
              { id: 'Root/Level 2/Level 2.3/Level 2.3.1', name: 'Level 2.3.1' },
            ],
          },
        ],
      },
      { id: 'Root/Level 3', name: 'Level 3' },
    ],
  };

  selectedItem: Item = this.rootFile;
  selectedPath = this.getPath(this.rootFile);

  selectItem(item: Item) {
    this.selectedItem = item;
    this.selectedPath = this.getPath(item);
  }

  getPath(item: Item) {
    let current = this.rootFile;
    const path = [current];
    if (item === this.rootFile) {
      return path;
    }

    const names = item.id.split('/').slice(1);
    for (const name of names) {
      const subItem = current.subItems.find((i) => i.name === name);
      if (subItem) {
        path.push(subItem);
        current = subItem;
      } else {
        break;
      }
    }
    console.log({ path });
    return path;
  }
}
