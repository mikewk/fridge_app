import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";

import {AuthService} from '../_graphql-services/auth.service';
import {LocalStorageService} from '../_services/local-storage.service';

/**
 * A material UI login prompt component with validation
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
              private localStorage: LocalStorageService,
              private route: ActivatedRoute,
              private router: Router) {
    //Just double check to make sure we're not logged in already
    let token = this.localStorage.getToken()
    if (token) {
      this.isLoggedIn = true;
      this.determineRoute();
    }
  }

  ngOnInit(): void {
    //Set returnURL and triple check that we're not logged in already
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    let token = this.localStorage.getToken()
    if (token != null) {
      this.isLoggedIn = true;
      this.determineRoute();
    }
  }

  determineRoute(): void {

    //If there was a returnURL go there
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]).then(this.reloadPage);
    } else {
      //Otherwise, just go to the dashboard.  If there's no household to go to, then they'll bounce to welcome
      this.router.navigate(["/dashboard"]).then(this.reloadPage);
    }

  }

  /**
   * Process the login form
   */
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
          this.localStorage.saveToken(data.token);
          this.localStorage.saveUser(data.user!);
          if( data.user?.defaultHousehold ) {
            let userType = "member";
            if( data.user.defaultHousehold.id == data.user.id)
              userType = "owner";
            this.localStorage.switchHousehold(data.user.defaultHousehold.id, userType)
          }
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.determineRoute();
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

  /**
   * Reload the page for some reason
   * TODO: Determine if we actually need this
   */
  reloadPage(): void {
    window.location.reload();
  }
}
