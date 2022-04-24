import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-username-dialog',
  templateUrl: './change-username-dialog.component.html',
  styleUrls: ['./change-username-dialog.component.css']
})
export class ChangeUsernameDialogComponent implements OnInit {
  form: any = {
    newUsername: "",
    password: ""
  }
  constructor() { }

  ngOnInit(): void {
  }

}
