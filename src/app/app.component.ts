import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageComponent } from './components/message/message.component';
import { MessageEnum } from './core/enums/message.enum';
import { ButtonComponent } from './components/button/button.component';
import { routes } from './app.routes';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MessageComponent,
    ButtonComponent,
    TableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Users';

  messageEnum = MessageEnum;
}
