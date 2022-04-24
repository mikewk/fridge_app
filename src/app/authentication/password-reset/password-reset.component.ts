import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../_services/local-storage.service";
import {AuthService} from "../../_graphql-services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  isLoggedIn: Boolean;
  isSuccessful: Boolean = false;
  form: any = {
    password: "",
    password2: ""
  }
  isResetFailed: boolean = false;
  errorMessage: string = "";
  key: string;

  constructor(private localStorage: LocalStorageService,
              private authService: AuthService,
              private route: ActivatedRoute) {
    // If we have a user, for now, just force them to log out
    // We can change this later to check the token and see if it matches the current user
    this.isLoggedIn = !!this.localStorage.getUser();
    this.key = this.route.snapshot.paramMap.get("key")??"";
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.authService.tryPasswordReset(this.form.password, this.key).subscribe((result)=>
    {
      if( result == "Success" ) {
        this.isSuccessful = true;
        this.isResetFailed = false;
      }
      else {
        this.isSuccessful = false;
        this.isResetFailed = true;
        this.errorMessage = result;
      }
    })
    return false;
  }
}
