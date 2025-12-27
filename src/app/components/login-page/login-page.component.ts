import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})

export class LoginPageComponent {
  userObject = {
    email: '',
    password: '',
  };

    onSubmit() {
    // Replace with proper handling (call service, navigate, etc.)
    console.log('login submitted', this.userObject);
  };
}