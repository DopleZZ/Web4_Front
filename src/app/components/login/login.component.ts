import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveBackgroundComponent } from '../interactive-background/interactive-background.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InteractiveBackgroundComponent]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    this.error = '';
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/main']);
    } catch (err) {
      this.error = this.authService.error || 'Произошла ошибка при входе.';
    }
  }
}
