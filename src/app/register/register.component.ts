import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../_graphql-services/auth.service';
import {LocalStorageService} from "../_services/local-storage.service";
import {ActivatedRoute, Router} from "@angular/router";


/**
 * A registration prompt component
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();
  form: any = {
    name: null,
    email: null,
    password: null,
    password2: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  returnUrl?: string;

  constructor(private authService: AuthService, private tokenStorage: LocalStorageService,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  onSubmit(): void {
    const {name, email, password, password2} = this.form;

    //Call the authentication service registration function
    //This also logs the user in if successful because who like having to log in twice
    this.authService.register(name, email, password).subscribe({
      next: data => {
        //If we have an API error, it will end up here
        if (data.error) {
          this.errorMessage = data.error;
          this.isSignUpFailed = true;
        } else {
          //If successful, save our token to keep us logged in
          this.tokenStorage.saveToken(data.token)
          this.isSuccessful = true;
          this.isSignUpFailed = false;

          //Tell app container that we've logged in
          this.loggedIn.emit();

           //If there was a returnURL go there
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]).then(this.reloadPage);
          } else {
              //Otherwise, go to the welcome page
              this.router.navigate(["/welcome"]).then(this.reloadPage);
            }
          }
        },
      //This is a much deeper error in the API call
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
