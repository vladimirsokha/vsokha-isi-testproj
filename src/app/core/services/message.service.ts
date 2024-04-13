import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MessageEnum } from '../enums/message.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageSubject: Subject<{type: MessageEnum, message: string}> = new Subject();
  message$ = this.messageSubject.asObservable();

  constructor() { }

}
