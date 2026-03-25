import { toast } from 'ngx-sonner';

// Not injectable since I wanted to do it a singleton.
export class Toaster {
  static success(message: string) {
    toast.success(message);
  }
  static error(message: unknown) {
    toast.error(
      message instanceof Error
        ? message.message
        : typeof message === 'string'
          ? message
          : 'Error inesperado',
    );
  }
}
