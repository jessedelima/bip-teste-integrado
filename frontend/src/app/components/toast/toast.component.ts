import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  messages: ToastMessage[] = [];
  sub?: Subscription;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toast.messages$.subscribe(msgs => this.messages = msgs);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  remove(id: number) { this.toast.remove(id); }
}