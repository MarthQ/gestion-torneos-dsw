import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Game } from '@shared/interfaces/game';
import { Tag } from '@shared/interfaces/tag';
import { EVENT_TAGS } from '@features/admin/interfaces/default-tags.const';

export class TournamentUtils {
  static tournamentStatusBadgeMap: Record<string, string> = {
    open: 'badge-success',
    closed: 'badge-warning',
    running: 'badge-primary',
    finished: 'badge-secondary',
    canceled: 'badge-error',
  };

  static tournamentActionMap: Record<string, string> = {
    open: 'Inscribirme',
    closed: 'Ver torneo',
    running: 'Ver peleas',
    finished: 'Ver podio',
    canceled: 'Ver torneo',
  };

  static tournamentStatusMap: Record<string, string> = {
    open: 'Abierto',
    closed: 'Cerrado',
    running: 'En Curso',
    finished: 'Finalizado',
    canceled: 'Cancelado',
  };

  static GetGameImage(game: Game, size = 'thumb'): string {
    if (!game.imgId || game.imgId === '') {
      return `https://placehold.co/600x400/1e293b/white?text=${game.name.replace(' ', '+')}`;
    }
    switch (size) {
      case 'medium':
        return `//images.igdb.com/igdb/image/upload/t_screenshot_big/${game.imgId}.jpg`;
      case 'big':
        return `//images.igdb.com/igdb/image/upload/t_1080p/${game.imgId}.jpg`;
      case 'thumb':
      case 'cover_big':
        return `//images.igdb.com/igdb/image/upload/t_cover_big/${game.imgId}.jpg`;
      case 'cover_small':
        return `//images.igdb.com/igdb/image/upload/t_cover_small/${game.imgId}.jpg`;
      case 'screenshot_big':
        return `//images.igdb.com/igdb/image/upload/t_screenshot_big/${game.imgId}.jpg`;
      default:
        return `//images.igdb.com/igdb/image/upload/t_thumb/${game.imgId}.jpg`;
    }
  }

  // ========== Tag exclusivity logic ==========

  /**
   * Grupos de tags que son mutuamente excluyentes entre sí.
   * No se puede seleccionar más de un tag del mismo grupo.
   */
  static readonly EXCLUSIVE_TAG_GROUPS: readonly string[][] = [
    [EVENT_TAGS.VIRTUAL.name, EVENT_TAGS.IN_PERSON.name],
    [EVENT_TAGS.HAS_PRIZE.name, EVENT_TAGS.NO_PRIZE.name],
  ];

  /**
   * Crea un validador para un FormArray de tags que verifica coherencia entre grupos excluyentes.
   * @param tagResource - Función reactiva que retorna el array de tags disponibles
   */
  static tagsCoherentValidator(tagResource: () => Tag[] | undefined): ValidatorFn {
    return (control: AbstractControl) => {
      const availableTags = tagResource();
      if (!availableTags?.length) return null;

      const tagIds: number[] = control.value ?? [];
      const selectedTagNames = availableTags
        .filter((t) => tagIds.includes(t.id))
        .map((t) => t.name);

      const hasConflict = TournamentUtils.EXCLUSIVE_TAG_GROUPS.some((group) =>
        group.filter((tag) => selectedTagNames.includes(tag)).length > 1,
      );

      return hasConflict ? { tagsNotCoherent: true } : null;
    };
  }

  /**
   * Toggle de tag con lógica de exclusividad.
   * Si el tag pertenece a un grupo exclusivo, remueve los otros del mismo grupo.
   * @param currentTags - Array de tags actualmente seleccionados
   * @param tagId - ID del tag a togglear
   * @param availableTags - Array de todos los tags disponibles
   * @returns Nuevo array de tags tras el toggle
   */
  static toggleExclusiveTag(
    currentTags: number[],
    tagId: number,
    availableTags: Tag[],
  ): number[] {
    const newTags = [...currentTags];
    const index = newTags.indexOf(tagId);
    const selectedTag = availableTags.find((t) => t.id === tagId);

    if (!selectedTag) return newTags;

    // Si ya está seleccionado, removerlo
    if (index !== -1) {
      newTags.splice(index, 1);
      return newTags;
    }

    // Buscar grupo exclusivo al que pertenece el tag
    const groupOfSelectedTag = TournamentUtils.EXCLUSIVE_TAG_GROUPS.find((group) =>
      group.includes(selectedTag.name),
    );

    // Si pertenece a un grupo exclusivo, remover los otros del mismo grupo
    if (groupOfSelectedTag) {
      const tagsToRemove = availableTags.filter(
        (t) => groupOfSelectedTag.includes(t.name) && newTags.includes(t.id),
      );
      tagsToRemove.forEach((t) => {
        const idx = newTags.indexOf(t.id);
        if (idx !== -1) newTags.splice(idx, 1);
      });
    }

    newTags.push(tagId);
    return newTags;
  }

  /**
   * Verifica si un tag está seleccionado.
   */
  static isTagSelected(currentTags: number[], tagId: number): boolean {
    return currentTags.includes(tagId);
  }

  // ========== Participants validation ==========

  /**
   * Crea un validador para maxParticipants que verifica sea >= inscripciones actuales + minExtra.
   * @param inscriptionsCount - Función que retorna la cantidad actual de inscripciones
   * @param minExtra - Mínimo de huecos adicionales (default: 2)
   */
  static minParticipantsValidator(
    inscriptionsCount: () => number,
    minExtra: number = 2,
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const currentInscriptions = inscriptionsCount();
      const minParticipants = currentInscriptions + minExtra;
      const value = control.value;

      if (value < minParticipants) {
        return { minParticipants: { min: minParticipants } };
      }
      return null;
    };
  }
}
