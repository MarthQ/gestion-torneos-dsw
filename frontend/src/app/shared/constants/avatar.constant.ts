export const AVATAR_BASE_PATH = './assets/profileImages';

export interface Avatar {
  id: string;
  label: string;
}

export const AVATARS: Avatar[] = [
  { id: 'Carmine', label: 'Carmine' },
  { id: 'Chun', label: 'Chun-Li' },
  { id: 'Eye', label: 'Eye' },
  { id: 'Jin', label: 'Jin Kazama' },
  { id: 'Johnny', label: 'Johnny' },
  { id: 'Jubei', label: 'Jubei' },
  { id: 'Kazuya', label: 'Kazuya Mishima' },
  { id: 'Mai', label: 'Mai Shiranui' },
  { id: 'Ragna', label: 'Ragna the Bloodedge' },
  { id: 'Remilia', label: 'Remilia Scarlet' },
  { id: 'Ryu', label: 'Ryu' },
  { id: 'Slayer', label: 'Slayer' },
  { id: 'Wesker', label: 'Wesker' }
];

export const DEFAULT_AVATAR_ID = 'Johnny';

export const getAvatarPath = (id: string | null | undefined): string => {
  const avatarId = id || DEFAULT_AVATAR_ID;
  return `${AVATAR_BASE_PATH}/${avatarId}.png`;
};