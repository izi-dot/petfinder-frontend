import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../domains';
import { AuthService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})

export class LoginPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: LoginRequest = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.authService.login(request).subscribe({
      next: () => {
        console.warn('Login successful');
        this.router.navigate(['/post']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

}