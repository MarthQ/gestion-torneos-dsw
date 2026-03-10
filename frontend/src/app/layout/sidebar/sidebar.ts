import { Component, signal } from '@angular/core';
import { Footer } from '../footer/footer';
import { Route, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [Footer, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styles: `
    #navbar-title {
      font-family: Segoe-Script;
      font-size: 1.8em;
    }
    #sidebar-toggle {
      transition: ease-in 0.3s;
    }
    #sidebar-toggle.toggled {
      rotate: 180deg;
      transition: ease-in 0.3s;
    }
  `,
})
export class Sidebar {
  isSidebarToggled = signal(false);

  // TODO: Cambiar por la función de auth en un futuro
  isAdmin = signal(true);

  adminSidebarButtons = signal([
    {
      name: 'CRUD Juegos',
      routerPath: 'admin/crud/game',
      icon: `icon-[bx--joystick]`,
    },
    {
      name: 'CRUD Tipo de juegos',
      routerPath: 'admin/crud/game-type',
      icon: `icon-[ri--game-line]`,
    },
    {
      name: 'CRUD Localidades',
      routerPath: 'admin/crud/location',
      icon: `icon-[mdi--location]`,
    },
    {
      name: 'CRUD Usuarios',
      routerPath: 'admin/crud/user',
      icon: `icon-[mdi--users]`,
    },
    {
      name: 'CRUD Torneos',
      routerPath: 'admin/crud/tournament',
      icon: `icon-[solar--cup-bold]`,
    },
    {
      name: 'CRUD Tags',
      routerPath: 'admin/crud/tag',
      icon: `icon-[tabler--tag]`,
    },
  ]);

  sidebarButtons = signal([
    {
      name: 'Explorar Torneos',
      routerPath: 'tournaments/explore',
      icon: `icon-[material-symbols--explore]`,
    },
    {
      name: 'Mis inscripciones',
      routerPath: 'tournaments/my-inscriptions',
      icon: `icon-[material-symbols--joystick]`,
    },
    {
      name: 'Configuraciones',
      routerPath: 'user-profile/settings',
      icon: `icon-[material-symbols--settings]`,
    },
  ]);

  toggleSidebar() {
    this.isSidebarToggled.update((current) => !current);
    console.log(this.isSidebarToggled());
  }
}
