import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageEnum } from '../../core/enums/message.enum';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MessageComponent implements OnInit, OnDestroy {

  @Input() type: MessageEnum = MessageEnum.SUCCESS;

  messageText = '';

  private subscriptions: Subscription[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.messageService.message$.subscribe(event => {
        if (!event) {return;}
        if (event.type === this.type) {
          this.messageText = event.message;
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
