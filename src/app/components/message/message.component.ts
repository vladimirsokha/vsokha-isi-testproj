import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('messageWrapper') divElementRef!: ElementRef;

  @Input() type: MessageEnum = MessageEnum.SUCCESS;

  messageText = '';

  private subscriptions: Subscription[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.messageService.message$.subscribe(event => {
        if (!event) {return;}
        if (event.type === this.type) {
          this.divElementRef.nativeElement.style.opacity = 1;
          this.messageText = event.message;
          setTimeout(() => {
            this.divElementRef.nativeElement.style.opacity = 0;
          }, 3000);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
