import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
})
export class SignUpPage {
  userObject = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  onSubmit() {
    // Replace with proper handling (call service, navigate, etc.)
    console.log('signup form submitted', this.userObject);
  }
}


