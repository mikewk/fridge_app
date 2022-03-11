import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  email: string = '';
  returnUrl: string = '';

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private route: ActivatedRoute,
              private router: Router) {
    let token = this.tokenStorage.getToken()
    if (token) {
      this.isLoggedIn = true;
      this.email = this.tokenStorage.getUser().email;
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    let token = this.tokenStorage.getToken()
    if (token != null) {
      this.isLoggedIn = true;
      this.email = this.tokenStorage.getUser().email;
      this.router.navigate([this.returnUrl])
    }

  }

  onSubmit(): void {
    const {username, password} = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        if (data.login.error) {
          this.errorMessage = data.signup.error;
          this.isLoginFailed = true;
        } else {
          this.tokenStorage.saveToken(data.login.token);
          this.email = this.tokenStorage.getUser().email;
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate([this.returnUrl])
          this.reloadPage();
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
