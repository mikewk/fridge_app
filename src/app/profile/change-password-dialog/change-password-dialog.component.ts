import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  passwords: any = {
    oldPassword: "",
    password: "",
    password2: ""
  }
  constructor() { }

  ngOnInit(): void {
  }

}
