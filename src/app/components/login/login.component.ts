import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  login(): void {
    this.userService.getUserByEmail(this.email).subscribe(
      (user) => {
        if (user) {
          sessionStorage.setItem('user', JSON.stringify(user)); 
          this.router.navigate(['/product']);
        } else {
          this.errorMessage = 'Usuário não encontrado!';
        }
      },
      (error) => {
        console.error('Erro ao buscar usuário:', error);
        this.errorMessage = 'Erro ao autenticar. Verifique suas credenciais!';
      }
    );

  }
}
