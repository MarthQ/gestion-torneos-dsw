import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/CRUD/game.service';
import { TagService } from 'src/app/services/CRUD/tag.service';
import { TournamentService } from 'src/app/services/CRUD/tournament.service';
import { Game, Tag, Tournament } from 'src/common/interfaces';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css'],
})
export class CreateTournamentComponent {
  constructor(
    private tagService: TagService,
    private gameService: GameService,
    private tournamentService: TournamentService
  ) {}
  isTournamentCreated: boolean = false;
  tagList: Tag[] = [];
  gameList: Game[] = [];

  creatingForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    datetimeinit: new FormControl(
      new Date().toISOString().slice(0, 16),
      Validators.required
    ),
    game: new FormControl(0, [Validators.required]),
    tags: new FormControl(),
  });

  ngOnInit() {
    this.tagService.getTags().subscribe((response: Tag[]) => {
      this.tagList = response;
    });

    this.gameService.getGames().subscribe((response: Game[]) => {
      this.gameList = response;
    });
  }

  createTournament() {
    let tournament = {
      id: 0,
      status: 'Pendiente',
      inscriptions: [],
      ...this.creatingForm.value,
      datetimeinit: new Date(this.creatingForm.value.datetimeinit!),
    };

    this.tournamentService
      .createTournament(tournament as Tournament)
      .subscribe((response: any) => {
        console.log('Tournament Created');
        console.log(response);
      });

    this.isTournamentCreated = true;
    this.creatingForm.reset();
  }
}
