import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {ActivatedRoute, Router} from "@angular/router";

/**
 * A login prompt component
 */
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

    //Use the auth service to try to loging with the supplied credentials
    this.authService.login(username, password).subscribe({
      next: data => {
        //If the error field is set, something went wrong
        //TODO: Create an error class/type system so errors can be handled appropriately on the front-end
        if (data.login.error) {
          this.errorMessage = data.login.error;
          this.isLoginFailed = true;
        } else {
          //If there's no error, then save the token, and get the user's email to show them they logged in successfully
          this.tokenStorage.saveToken(data.login.token);
          this.email = this.tokenStorage.getUser().email;
          this.isLoginFailed = false;
          this.isLoggedIn = true;

          //Go to the returnURL if there was one
          this.router.navigate([this.returnUrl])
          this.reloadPage();
        }
      },
      //This will only happen if there's a much deeper error with the API call
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
