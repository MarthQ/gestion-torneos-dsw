import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Inscription, Tournament, User } from 'src/common/interfaces';

@Component({
  selector: 'app-user-inscription-modal',
  templateUrl: './user-inscription-modal.component.html',
  styleUrls: ['./user-inscription-modal.component.css'],
})
export class UserInscriptionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UserInscriptionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  user: User = this.data.user;
  tournament: Tournament = this.data.tournament;

  inscriptionForm = new FormGroup({
    user: new FormControl(this.user.name, [Validators.required]),
    nickname: new FormControl(this.user.name, [Validators.required]),
    tournament: new FormControl(this.tournament.name, [Validators.required]),
  });

  confirm() {
    let inscription = {
      victories: 0,
      loses: 0,
      nickname: this.inscriptionForm.value.nickname,
      inscriptionDate: new Date().toISOString(),
      user: this.user.id,
      tournament: this.tournament.id,
    };

    this.dialogRef.close(inscription);
  }
}
