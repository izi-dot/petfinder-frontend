// sidebar.component.ts
import {
  Component, Input, Output, EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService, JwtPayload } from '../../services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('280ms cubic-bezier(0.4,0,0.2,1)')
      ]),
      transition(':leave', [
        animate('220ms cubic-bezier(0.4,0,0.2,1)',
          style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('280ms ease')
      ]),
      transition(':leave', [
        animate('220ms ease', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() 
  isOpen = false;

  @Input() 
  user?: JwtPayload;

  @Output() 
  closed = new EventEmitter<void>();

  @Output() 
  getMyPosts = new EventEmitter<string>();

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser(); 
  }

  close() {
    this.closed.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  onGetMyPosts() {
    const userName = `${this.user?.firstName} ${this.user?.lastName}`;
    this.getMyPosts.emit(userName);
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
     if (this.isOpen) {
      this.close();
    } 
  }
}