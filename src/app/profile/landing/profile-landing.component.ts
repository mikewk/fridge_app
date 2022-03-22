import { Component, OnInit } from '@angular/core';
import {ComponentType} from "@angular/cdk/overlay";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {HouseholdService} from "../../_services/household.service";
import {ProfileAddHouseholdComponent} from "../add-household/profile-add-household.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {HouseholdsPayload, User} from "../../graphql.types";
import {ProfileChangeDefaultComponent} from "../change-default/profile-change-default.component";
import {UserService} from "../../_services/user.service";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-landing',
  templateUrl: './profile-landing.component.html',
  styleUrls: ['./profile-landing.component.css']
})
export class ProfileLandingComponent implements OnInit {

  constructor(private householdService: HouseholdService,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private dialogHelper: DialogHelperService,
              private localStorage: LocalStorageService
              ) { }

  ngOnInit(): void {
  }

  changeDefault() {
    this.dialogHelper.launchDialog(ProfileChangeDefaultComponent,
                                  (x:any) => this.userService.changeDefault(x)).subscribe({
      next: data => {
        if (data.users[0]) {
          this.snackBar.open("Default Household Changed Successfully", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
          let user = this.localStorage.getUser();
          if( user ) {
            user.defaultHousehold = data.users[0].defaultHousehold;
            this.localStorage.saveUser(user);
          }

        } else {
          console.log(data);
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  addHousehold() {
    this.dialogHelper.launchDialog(ProfileAddHouseholdComponent, (x: any) => this.householdService.addHousehold(x)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.household) {
          this.snackBar.open("Household Added Successfully", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
        } else {
          console.log(data);
        }
      },
      error: err => {
        console.log(err);
      }
    });

  }

  changeName() {

  }

  changeUserPass() {

  }
}
