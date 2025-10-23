import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  timeout: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private messagesSubject = new Subject<ToastMessage[]>();
  messages$ = this.messagesSubject.asObservable();
  private messages: ToastMessage[] = [];

  show(type: ToastType, text: string, timeout = 3000) {
    const id = ++this.counter;
    const msg: ToastMessage = { id, type, text, timeout };
    this.messages.push(msg);
    this.emit();
    setTimeout(() => this.remove(id), timeout);
  }

  showSuccess(text: string, timeout = 3000) { this.show('success', text, timeout); }
  showError(text: string, timeout = 5000) { this.show('error', text, timeout); }
  showInfo(text: string, timeout = 3000) { this.show('info', text, timeout); }

  remove(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.emit();
  }

  clear() {
    this.messages = [];
    this.emit();
  }

  private emit() { this.messagesSubject.next([...this.messages]); }
}