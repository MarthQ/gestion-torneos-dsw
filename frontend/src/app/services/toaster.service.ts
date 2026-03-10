import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  static success(message: string) {
    toast.success(message);
  }
  static error(message: string, description?: string) {
    toast.error(message, {
      description: description,
    });
  }
}
