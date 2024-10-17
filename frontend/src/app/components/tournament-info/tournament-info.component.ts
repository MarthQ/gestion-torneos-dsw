import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/CRUD/inscription.service';
import { TournamentService } from 'src/app/services/CRUD/tournament.service';
import { UserService } from 'src/app/services/User/user.service';
import { Inscription, Tournament, User, Location } from 'src/common/interfaces';

@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.css']
})
export class TournamentInfoComponent { 
  tournament: Tournament | null=null;
  user: User[] = [];
  location: Location[] = [];
  inscriptions: Inscription[] = [];
  dataSource: any;
  tableHeaders: string[] = ['user', 'nickname','inscriptionDate'];
  curTournament: number=0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private tournamentService: TournamentService,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ){
    this.getInscriptions();
  }
  ngOnInit(){
    this.route.params.subscribe(params => {this.curTournament = params['id']})
  }
  getInscriptions(){
      this.inscriptionService.getInscriptions()
      .subscribe((response: Inscription[]) => {
      for(let inscription of response){
        if(inscription.tournament?.id ==this.curTournament){
          this.inscriptions.push(inscription)
        }
        console.log(response);
        this.dataSource= this.inscriptions;
      }})
  }
  formatUser(user:User):string{
    return user.name
  }
}
