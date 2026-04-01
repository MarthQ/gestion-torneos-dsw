import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  templateUrl: './user-profile.html',
})
export class UserProfile {
  //TODO implement a button to change password -> send email with link that redirect to a page to change the password (We can reuse the request setup-password-page).

  private authService = inject(AuthService);
  private userService = inject(UserService);

  userResource = rxResource({
    params: () => ({ userId: this.authService.user()!.id }),
    stream: ({ params }) => {
      return this.userService.getUserById(params.userId).pipe(map((resp) => (resp as any).data));
    },
  });

  logout() {
    this.authService.logout();
  }
}
