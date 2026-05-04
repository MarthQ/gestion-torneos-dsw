import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'okizeme-theme';
  private readonly DEFAULT_THEME = 'crimsoncore';

  currentTheme = signal<string>(this.loadTheme());

  private loadTheme(): string {
    return localStorage.getItem(this.STORAGE_KEY) ?? this.DEFAULT_THEME;
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.currentTheme.set(theme);
  }

  initTheme() {
    this.setTheme(this.currentTheme());
  }
}
