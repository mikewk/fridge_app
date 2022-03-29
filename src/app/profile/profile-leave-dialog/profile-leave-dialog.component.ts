import { Component, OnInit } from '@angular/core';
import {Household, User} from "../../graphql.types";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../_graphql-services/user.service";
import {first} from "rxjs";

@Component({
  selector: 'app-profile-leave-dialog',
  templateUrl: './profile-leave-dialog.component.html',
  styleUrls: ['./profile-leave-dialog.component.css']
})
export class ProfileLeaveDialogComponent implements OnInit {

  householdToLeave?: Household;
  households?: Household[];
  user?: User;

  constructor(private snackBar: MatSnackBar,
              private userService: UserService) {
    //Set our household data
  }

  ngOnInit(): void {
    this.userService.getUser().pipe(first()).subscribe(data=>
    {
      if( data.users )
      {
        this.user = data.users[0];
        this.households = this.user.memberHouseholds.filter(x=>x.owner!.id!=this.user!.id);
      }
    });
  }
}
