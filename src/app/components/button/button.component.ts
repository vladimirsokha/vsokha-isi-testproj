import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonEnum } from '../../core/enums/button.enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ButtonComponent implements OnInit {

  @Input() type: ButtonEnum = ButtonEnum.DEFAULT;
  @Input() text: string = '';

  constructor() { }

  ngOnInit() {
  }

}
