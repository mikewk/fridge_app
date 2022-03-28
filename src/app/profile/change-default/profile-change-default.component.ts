import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from "@angular/material/snack-bar";

import {Household, User} from "../../graphql.types";
import {LocalStorageService} from "../../_services/local-storage.service";
import {UserService} from "../../_graphql-services/user.service";

/**
 * Simple dialog to change a user's default household
 */
@Component({
  selector: 'app-change-default',
  templateUrl: './profile-change-default.component.html',
  styleUrls: ['./profile-change-default.component.css']
})
export class ProfileChangeDefaultComponent implements OnInit {
  defaultHousehold?: Household;
  households?: Household[];
  user?: User;

  constructor(private snackBar: MatSnackBar,
              private userService: UserService) {
    //Set our household data
  }

  ngOnInit(): void {
        this.userService.getUser().subscribe(data=>
        {
          if( data.users )
          {
            this.user = data.users[0];
            this.defaultHousehold = this.user.defaultHousehold;
            this.households = this.user.memberHouseholds;
          }
        })
  }

  //A comparator so the currently selected house is selected in the form input
  compareHouseholds(a: Household, b: Household): boolean {
    return a.id == b.id;
  }

}
