import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_graphql-services/auth.service';
import {LocalStorageService} from "../_services/local-storage.service";


/**
 * A registration prompt component
 */
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

  constructor(private authService: AuthService, private tokenStorage: LocalStorageService) {
  }

  ngOnInit(): void {
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
}
