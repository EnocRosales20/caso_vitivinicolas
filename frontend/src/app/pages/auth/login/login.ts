import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  usuario = '';
  password = '';
  rol = '';

  constructor(private router: Router) {}

  login() {
    if (!this.usuario || !this.password || !this.rol) {
      alert('Complete todos los campos');
      return;
    }

    localStorage.setItem('rol', this.rol);
    this.router.navigate(['/dashboard']);
  }
}
