import { Pipe, PipeTransform } from '@angular/core';

export const IGDB_SIZE = {
  CARD: 'cover_big',
  BANNER: 'screenshot_huge',
  THUMB: 'thumb',
  // COVER_SMALL: 'cover_small',
  // SCREENSHOT_MED: 'screenshot_med',
  // SCREENSHOT_BIG: 'screenshot_big',
  // MICRO: 'micro',
  // LOGO_MED: 'logo_med',
  // COVER_BIG_2X: 'cover_big_2x',
  // SCREENSHOT_BIG_2X: 'screenshot_big_2x',
  // SCREENSHOT_HUGE_2X: 'screenshot_huge_2x',
  // LOGO_MED_2X: 'logo_med_2x',
  // THUMB_2X: 'thumb_2x',
  // HD: '720p',
  // FULL_HD: '1080p',
} as const;

export type IgdbSize = (typeof IGDB_SIZE)[keyof typeof IGDB_SIZE];

@Pipe({
  name: 'gameImage',
})
export class GameImagePipe implements PipeTransform {
  transform(value: null | string, size: IgdbSize = 'thumb'): string {
    if (value === null) {
      return 'https://placehold.co/600x400/1e293b/white';
    }

    return `https://images.igdb.com/igdb/image/upload/t_${size}${window.devicePixelRatio >= 2 ? '_2x' : ''}/${value}.jpg`;
  }
}
