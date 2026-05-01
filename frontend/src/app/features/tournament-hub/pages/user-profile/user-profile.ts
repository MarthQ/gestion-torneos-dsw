import { Component, inject, viewChild, ElementRef, computed} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AVATARS, getAvatarPath } from '@shared/constants/avatar.constant';
import { Toaster } from '@shared/utils/toaster';
import { User, UserUpdateDTO } from '@shared/interfaces/user';

@Component({
  imports: [RouterLink],
  templateUrl: './user-profile.html',
})
export class UserProfile{
  //TODO implement a button to change password -> send email with link that redirect to a page to change the password (We can reuse the request setup-password-page).

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private modalRef = viewChild<ElementRef<HTMLDialogElement>>('avatarModal');
  readonly availableAvatars = AVATARS;
  getAvatarPath = getAvatarPath;

  userResource = rxResource({
    params: () => ({ userId: this.authService.user()!.id }),
    stream: ({ params }) => {
      return this.userService.getUserById(params.userId).pipe(map((resp) => (resp as any).data));
    },
  });

  canChangeName = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser?.nameChangedOn) return true;
    
    const fechaLimite = new Date(currentUser.nameChangedOn);
    fechaLimite.setMonth(fechaLimite.getMonth() + 3);
    return new Date() >= fechaLimite;
  })


  updateAvatar(avatarId: string) {
    const currentUser = this.authService.user();

    if (!currentUser) {
      Toaster.error('Tu sesión ha expirado. Por favor, vuelve a ingresar.');
      return;
    }
    
    const { id, name } = currentUser
    const updatedUser = { id, name, avatarId } as UserUpdateDTO;

    
    this.userService.updateUserNonAdmin(updatedUser).subscribe({
      next: () => {
        this.authService.updateUserData({ avatarId });
        this.userResource.reload();
        this.modalRef()?.nativeElement.close();
        Toaster.success('Avatar actualizado correctamente');
      },
      error: (err) => {
        Toaster.error('No se pudo actualizar el avatar');
        console.error(err);
      }
    });
  }

  updateUsername(changedName: string) {
    if (!changedName || changedName.trim().length < 1) {
    Toaster.error('El nombre no puede estar vacío');
    return;
    }
    
    const currentUser = this.authService.user();

    if (!currentUser) {
      Toaster.error('Tu sesión ha expirado. Por favor, vuelve a ingresar.');
      this.modalRef()?.nativeElement.close();
      return;
    }
    if(currentUser.nameChangedOn){
      const fechaLimite = new Date(currentUser.nameChangedOn);
      fechaLimite.setMonth(fechaLimite.getMonth() + 3);
      if( new Date < fechaLimite ){
        Toaster.error('Aún no podés cambiar tu nombre.');
        this.modalRef()?.nativeElement.close();
        return
      }
    }

    const { id } = currentUser
    const updatedUser: UserUpdateDTO = {
      id,
      name: changedName,
      nameChangedOn: new Date()
    }

    
    this.userService.updateUserNonAdmin(updatedUser).subscribe({
      next: () => {
        this.authService.updateUserData({ name: changedName, nameChangedOn: new Date() });
        this.userResource.reload();
        this.modalRef()?.nativeElement.close();
        Toaster.success('Nombre de usuario actualizado correctamente');
      },
      error: (err) => {
        if(err.status === 409) {
          Toaster.error('El nombre de usuario ya existe. Elige uno nuevo.')
        } else{
          Toaster.error('No se pudo actualizar el nombre de usuario');
          console.error(err);
        }
      }
    });
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
