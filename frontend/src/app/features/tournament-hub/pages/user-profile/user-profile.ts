import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { User } from '@shared/interfaces/user';
import { Toaster } from '@shared/utils/toaster';
import { ThemeService } from '@shared/services/theme.service';
import { AvailableLocale, LocaleService } from '@shared/services/locale.service';

@Component({
  imports: [RouterLink],
  templateUrl: './user-profile.html',
})
export class UserProfile {
  //TODO implement a button to change password -> send email with link that redirect to a page to change the password (We can reuse the request setup-password-page).

  private authService = inject(AuthService);
  private userService = inject(UserService);
  themeService = inject(ThemeService);
  private localeService = inject(LocaleService);

  userResource = rxResource({
    params: () => ({ userId: this.authService.user()!.id }),
    stream: ({ params }) => {
      return this.userService.getUserById(params.userId).pipe(map((resp) => (resp as any).data));
    },
  });

  changeTheme(newtheme: string) {
    this.themeService.setTheme(newtheme);
  }

  getLocale() {
    return this.localeService.getLocale;
  }

  changeLocale(locale: string) {
    this.localeService.changeLocale(locale as AvailableLocale);
  }

  logout() {
    this.authService.logout();
  }

  sendInvitation() {
    const frontendUrl = '/setup-password';
    const user = this.userResource.value();
    this.userService.sendInvitation(user.id, frontendUrl).subscribe({
      next: () => {
        Toaster.success(`Email enviado correctamente a ${user.mail}`);
      },
      error: (message) => {
        Toaster.error(message);
        console.log(message);
      },
    });
  }
}
