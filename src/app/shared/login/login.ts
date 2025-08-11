import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  formData = {
    email: '',
    password: '',
    remember: false,
  };

  constructor(private loginService: LoginService, private router: Router ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const { email, password } = this.formData;

      this.loginService.signIn({ email, password }).subscribe({
        next: () => {
          console.log('Login success');
          this.router.navigate(['/'], { queryParams: { t: Date.now() } }); // force new navigation
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Login failed. Please check your credentials.');
        },
      });
    } else {
      alert('Please fill in both email and password.');
    }
  }
}
