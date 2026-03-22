import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
})
export class UserProfile {
private authService = inject(AuthService)
private router = inject(Router);

ngOnInit(){
  if(localStorage.getItem('access_token')==null){this.router.navigate(['/tournaments'])}else{}
}

logout(){
  localStorage.removeItem('access_token')
  this.router.navigate(['/tournaments'])
};

}
