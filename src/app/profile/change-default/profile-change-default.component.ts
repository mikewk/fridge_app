import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

import {Household, User} from "../../graphql.types";
import {LocalStorageService} from "../../_services/local-storage.service";

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
              private localStorageService: LocalStorageService) {
    //Set our household data
  }

  ngOnInit(): void {
    this.user = this.localStorageService.getUser()!;
    this.defaultHousehold = this.user.defaultHousehold;
    this.households = this.user.memberHouseholds;
  }


  //A comparator so the currently selected house is selected in the form input
  compareHouseholds(a: Household, b: Household): boolean {
    return a.id == b.id;
  }

}
