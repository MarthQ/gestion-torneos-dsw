import { DatePipe, I18nSelectPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { InscriptionModal } from '@features/tournament/components/inscription-modal/inscription-modal';
import { InscriptionService } from '@features/tournament/services/inscription.service';
import { TournamentStatus } from '@shared/interfaces/tournamentStatus';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { map, tap } from 'rxjs';
import { ConfirmModal } from '@features/tournament/components/confirm-modal/confirm-modal';
import { getAvatarPath } from '@shared/constants/avatar.constant';

@Component({
  imports: [I18nSelectPipe, DatePipe, TitleCasePipe, InscriptionModal, ConfirmModal],
  templateUrl: './overview.html',
})
export class Overview {
  user = inject(AuthService).user();
  activatedRoute = inject(ActivatedRoute);
  tournamentId = toSignal(
    this.activatedRoute.parent!.paramMap.pipe(map((paramMap) => paramMap.get('id'))),
  );
  getBackgroundStyle = TournamentUtils.GetGameImage;
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;
  tournamentStatusBadgeMap = TournamentUtils.tournamentStatusBadgeMap;
  getAvatarPath = getAvatarPath;

  // Inscription modal
  isModalOpen = signal(false);
  modalType = signal<'add' | 'delete'>('add');

  // Confirm transition status modal
  confirmModalType = signal<'close' | 'start' | 'end' | 'cancel' | 'reopen'>('close');
  isConfirmModalOpen = signal<boolean>(false);

  private tournamentService = inject(TournamentService);
  private inscriptionService = inject(InscriptionService);

  tournamentSteps = [
    { name: 'Inscripciones' },
    { name: 'Generación de llave' },
    { name: 'En Curso' },
    { name: 'Finalizado' },
  ];

  private statusToStepIndex: Record<TournamentStatus, number> = {
    open: 0,
    closed: 1,
    running: 2,
    finished: 3,
    canceled: 0,
  };

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(map((response) => response.tournamentData));
    },
  });

  userIsCreator(): boolean {
    if (this.tournamentResource.hasValue() && this.user) {
      return this.user.id === this.tournamentResource.value().creator.id;
    }
    return false;
  }

  userIsInscribed() {
    if (this.tournamentResource.hasValue() && this.user) {
      return this.tournamentResource
        .value()!
        .inscriptions?.find((inscription) => inscription.user?.id === this.user!.id);
    }
    return false;
  }

  // Participants left to reach the maximum
  participantsLeft(): number {
    return (
      (this.tournamentResource.value()?.maxParticipants || 0) -
      (this.tournamentResource.value()?.inscriptions?.length || 0)
    );
  }

  // This helps to visualize the steps based on tournament's status
  get activeStepIndex(): number {
    const status = this.tournamentResource.value()?.status as TournamentStatus | undefined;
    return status ? this.statusToStepIndex[status] : 0;
  }

  openInscriptionModal(type: 'add' | 'delete') {
    this.modalType.set(type);
    this.isModalOpen.set(true);
  }

  openConfirmationModal(type: 'close' | 'start' | 'end' | 'cancel' | 'reopen') {
    this.confirmModalType.set(type);
    this.isConfirmModalOpen.set(true);
  }

  onInscriptionConfirmed(data: { nickname: string }) {
    const tournamentId = this.tournamentResource.value()!.id;

    this.inscriptionService.inscribeToTournament(tournamentId, data.nickname).subscribe({
      next: () => {
        Toaster.success('Te inscribiste correctamente');
        this.isModalOpen.set(false);
        this.tournamentResource.reload();
      },
      error: (msg) => Toaster.error(msg),
    });
  }
  onDeletionConfirmed() {
    const tournamentId = this.tournamentResource.value()!.id;

    this.inscriptionService.deleteInscription(tournamentId).subscribe({
      next: () => {
        Toaster.success('Inscripción eliminada');
        this.isModalOpen.set(false);
        this.tournamentResource.reload();
      },
      error: (msg) => Toaster.error(msg),
    });
  }

  onConfirm() {
    this.isConfirmModalOpen.set(false);
    if (this.tournamentResource.hasValue()) {
      switch (this.confirmModalType()) {
        case 'close':
          this.tournamentService.closeInscriptions(this.tournamentResource.value().id).subscribe({
            next: () => {
              Toaster.success('El torneo ha cerrado sus inscripciones!');
              this.tournamentResource.reload();
            },
            error: (msg) => Toaster.error(msg),
          });
          break;
        case 'start':
          this.tournamentService.startTournament(this.tournamentResource.value().id).subscribe({
            next: () => {
              Toaster.success('El torneo ha comenzado!');
              this.tournamentResource.reload();
            },
            error: (msg) => Toaster.error(msg),
          });
          break;
        case 'end':
          this.tournamentService.endTournament(this.tournamentResource.value().id).subscribe({
            next: () => {
              Toaster.success('El torneo ha finalizado!');
              this.tournamentResource.reload();
            },
            error: (msg) => Toaster.error(msg),
          });
          break;
        case 'reopen':
          this.tournamentService.reopenTournament(this.tournamentResource.value().id).subscribe({
            next: () => {
              Toaster.success('El torneo se ha reabierto!');
              this.tournamentResource.reload();
            },
            error: (msg) => Toaster.error(msg),
          });
          break;
        case 'cancel':
          this.tournamentService.cancelTournament(this.tournamentResource.value().id).subscribe({
            next: () => {
              Toaster.success('El torneo ha sido cancelado');
              this.tournamentResource.reload();
            },
            error: (msg) => Toaster.error(msg),
          });
      }
    }
  }
}
