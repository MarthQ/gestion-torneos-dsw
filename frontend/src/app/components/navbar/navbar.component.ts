import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}
  isToggled = false;
  @Output() sidebarActive = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isToggled = !this.isToggled;
    this.sidebarActive.emit(this.isToggled);
  }
}
