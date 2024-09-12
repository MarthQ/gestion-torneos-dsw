import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TournamentService } from 'src/app/services/CRUD/tournament.service';
import { UserCrudService } from 'src/app/services/CRUD/user-crud.service';
import { Tournament, User } from 'src/common/interfaces';

@Component({
  selector: 'app-inscription-modal',
  templateUrl: './inscription-modal.component.html',
})
export class InscriptionModalComponent {
  constructor(
    private userService: UserCrudService,
    private tournamentService: TournamentService,
    public dialogRef: MatDialogRef<InscriptionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  userList: User[] = [];

  tournamentList: Tournament[] = [];

  type: string = '';

  inscriptionForm = new FormGroup({
    user: new FormControl(null, [Validators.required, selectRequiredValidator]),
    tournament: new FormControl(null, [
      Validators.required,
      selectRequiredValidator,
    ]),
    score: new FormControl('', Validators.pattern('^[0-9999]*$')),
    ranking: new FormControl('', Validators.pattern('^[0-9999]*$')),
    inscriptiondate: new FormControl(new Date(), Validators.required),
  });

  ngOnInit() {
    this.userService
      .getUsers()
      .subscribe((response: User[]) => (this.userList = response));

    this.tournamentService
      .getTournaments()
      .subscribe((response: Tournament[]) => (this.tournamentList = response));

    console.log(this.data.inscription);

    this.initializeForms();

    if (this.data.inscription.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.inscriptionForm.setValue({
      user: this.data.inscription.user?.id || null,
      tournament: this.data.inscription.tournament?.id || null,
      score: this.data.inscription.score,
      ranking: this.data.inscription.ranking,
      inscriptiondate: this.data.inscription.inscriptiondate,
    });
  }

  generateDate() {
    new Date();
  }

  saveChanges() {
    let inscriptionResponse = {
      id: this.data.inscription.id,
      ...this.inscriptionForm.value,
    };

    console.log(inscriptionResponse);

    this.dialogRef.close(inscriptionResponse);
  }
}

export function selectRequiredValidator(ctrl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value && control.value > 0
      ? null
      : { required: { value: control.value } };
  };
}
