import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

// Not injectable since I wanted to do it a singleton.
export class ToasterService {
  static success(message: string) {
    toast.success(message);
  }
  static error(message: string) {
    toast.error(message);
  }
}
