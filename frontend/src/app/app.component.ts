import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'NavBar-Test';

  onSidebarActive(isActive: boolean) {
    let mainContent = document.getElementById('main-content');
    mainContent?.classList.toggle('sidebarActive');
  }
}
