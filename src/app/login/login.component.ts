import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {LocalStorageService} from '../_services/local-storage.service';
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
              private tokenStorage: LocalStorageService,
              private route: ActivatedRoute,
              private router: Router) {
    let token = this.tokenStorage.getToken()
    if (token) {
      this.isLoggedIn = true;
      this.determineRoute();
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    let token = this.tokenStorage.getToken()
    if (token != null) {
      this.isLoggedIn = true;
      this.determineRoute();
    }
  }

  determineRoute() : void  {
    const user = this.tokenStorage.getUser();
    if( !this.tokenStorage.getHousehold() && user?.defaultHousehold)
    {
      this.tokenStorage.saveHousehold(user.defaultHousehold);
    }

    if( this.returnUrl )
    {
      this.router.navigate([this.returnUrl]);
    }
    else {
      if( this.tokenStorage.getHousehold() ) {
        this.router.navigate(["/dashboard"]);
      } else {
        this.router.navigate(["/welcome"]);
      }
    }
  }

  onSubmit(): void {
    const {username, password} = this.form;

    //Use the auth service to try to loging with the supplied credentials
    this.authService.login(username, password).subscribe({
      next: data => {
        //If the error field is set, something went wrong
        //TODO: Create an error class/type system so errors can be handled appropriately on the front-end
        if (data.error) {
          this.errorMessage = data.error;
          this.isLoginFailed = true;
        } else {
          //If there's no error, then save the token, and get the user's email to show them they logged in successfully
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data.user!);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.determineRoute();
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
