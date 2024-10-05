import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  // TODO: Make an Input coming from the navbar telling its state so we can alter the opacity of the data.
  user = {
    name: 'John Doe',
    email: 'johndoe@email.com',
  };
}
