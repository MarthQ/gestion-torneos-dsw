export const AUTH_STATUS = {
  CHECKING: 'checking',
  AUTHENTICATED: 'authenticated',
  NOT_AUTHENTICATED: 'not-authenticated',
};

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
