import { Component } from '@angular/core';

interface Tournament {
  id: number;
  imgUrl: string;
  status: string;
  participants: number;
  maxParticipants: number;
  name: string;
  location: string;
  datetime: string;
}

@Component({
  selector: 'app-explore',
  imports: [],
  templateUrl: './explore.html',
})
export class Explore {
  tournaments: Tournament[] = [
    {
      id: 1,
      imgUrl: '',
      status: 'Abierto',
      participants: 5,
      maxParticipants: 16,
      name: 'Mortal Kombat',
      location: 'San Nicolás',
      datetime: '29 de octubre 15:00hs',
    },
    {
      id: 2,
      imgUrl: 'https://example.com/fifa.jpg',
      status: 'Cerrado',
      participants: 16,
      maxParticipants: 16,
      name: 'FIFA 24',
      location: 'Rosario',
      datetime: '5 de noviembre 18:30hs',
    },
    {
      id: 3,
      imgUrl: 'https://example.com/cod.jpg',
      status: 'En curso',
      participants: 12,
      maxParticipants: 12,
      name: 'Call of Duty Warzone',
      location: 'Buenos Aires',
      datetime: '12 de noviembre 20:00hs',
    },
    {
      id: 4,
      imgUrl: 'https://example.com/lol.jpg',
      status: 'Abierto',
      participants: 8,
      maxParticipants: 10,
      name: 'League of Legends',
      location: 'Córdoba',
      datetime: '18 de noviembre 14:00hs',
    },
    {
      id: 5,
      imgUrl: '',
      status: 'Abierto',
      participants: 3,
      maxParticipants: 8,
      name: 'Valorant',
      location: 'La Plata',
      datetime: '25 de noviembre 19:00hs',
    },
    {
      id: 6,
      imgUrl: 'https://example.com/smash.jpg',
      status: 'Finalizado',
      participants: 16,
      maxParticipants: 16,
      name: 'Super Smash Bros Ultimate',
      location: 'Mendoza',
      datetime: '2 de octubre 16:00hs',
    },
  ];
  statusBadgeColorMap(tournamentStatus: string): string {
    switch (tournamentStatus) {
      case 'Abierto':
        return 'bg-green-500';
      case 'Cerrado':
        return 'bg-red-500';
      case 'En curso':
        return 'bg-yellow-500';
      case 'Finalizado':
        return 'bg-orange-500';
      default:
        return 'bg-grey-500';
    }
  }
  buttonActionMap(tournamentStatus: string): string {
    switch (tournamentStatus) {
      case 'Abierto':
        return 'Inscribirme';
      case 'Cerrado':
      case 'Finalizado':
        return 'Ver podio';
      case 'En curso':
        return 'Ver Llaves';
      default:
        return 'Ver Torneo';
    }
  }

  getBackgroundImageStyle(tournament: Tournament) {
    if (tournament.imgUrl) {
      return `background-image: url('${tournament.imgUrl}');`;
    } else {
      return `background-image: url(https://placehold.co/600x400/1e293b/white?text=${tournament.name.replace(' ', '+')});`;
    }
  }
}
