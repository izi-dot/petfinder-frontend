import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  userObject = {
    email: '',
    password: '',
  };

    onSubmit() {
    // Replace with proper handling (call service, navigate, etc.)
    console.log('login submitted', this.userObject);
  };
}