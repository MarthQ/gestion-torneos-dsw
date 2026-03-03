import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}
  @Output() menuClicked = new EventEmitter();
  @Output() accountClicked = new EventEmitter();

  showMenu() {
    this.menuClicked.emit();
  }

  showAccount() {
    this.accountClicked.emit();
  }
}
