import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
})
export class UserProfile {
private authService = inject(AuthService)
private router = inject(Router);
private http = inject(HttpClient);

ngOnInit(){
  this.authService.checkLogged()
}

logout() {
  this.http.get(`${environment.apiUrl}/login/logout/`,{withCredentials: true}).subscribe();
  this.router.navigate(['/tournaments']);
}

}
