import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_graphql-services/auth.service";

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent implements OnInit {
  username: string = "";
  sentRequest: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    //Fire and forget our password reset email
    this.authService.sendPasswordReset(this.username).subscribe(()=>undefined);
    this.sentRequest = true;
  }
}
