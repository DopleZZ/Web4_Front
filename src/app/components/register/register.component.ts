import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveBackgroundComponent } from '../interactive-background/interactive-background.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InteractiveBackgroundComponent]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    this.message = '';
    if (this.password !== this.confirmPassword) {
      this.message = 'Пароли не совпадают.';
      return;
    }
    try {
      await this.authService.register(this.username, this.password);
      if (!this.authService.error) {
        this.message = 'Регистрация прошла успешно.';
        this.router.navigate(['/']);
      } else {
        this.message = this.authService.error;
      }
    } catch (err) {
      this.message = 'Произошла ошибка при регистрации.';
    }
  }
}
