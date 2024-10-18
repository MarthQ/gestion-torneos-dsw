import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  menuSideBarActive: boolean = false;
  accountSideBarActive: boolean = false;

  showMenu() {
    this.menuSideBarActive = !this.menuSideBarActive;
  }
  showAccount() {
    this.accountSideBarActive = !this.accountSideBarActive;
  }
}
