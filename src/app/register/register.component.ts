import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    name: null,
    email: null,
    password: null,
    password2: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const {name, email, password, password2} = this.form;

    this.authService.register(name, email, password).subscribe({
      next: data => {
        console.log(data);
        if (data.signup.error) {
          this.errorMessage = data.signup.error;
          this.isSignUpFailed = true;
        } else {
          this.tokenStorage.saveToken(data.signup.token)
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        }

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
