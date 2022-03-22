import { Component, OnInit } from '@angular/core';
import {ComponentType} from "@angular/cdk/overlay";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {HouseholdService} from "../../_services/household.service";
import {ProfileAddHouseholdComponent} from "../add-household/profile-add-household.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {HouseholdsPayload} from "../../graphql.types";

@Component({
  selector: 'app-landing',
  templateUrl: './profile-landing.component.html',
  styleUrls: ['./profile-landing.component.css']
})
export class ProfileLandingComponent implements OnInit {

  constructor(private householdService: HouseholdService,
              private snackBar: MatSnackBar,
              private dialogHelper: DialogHelperService
              ) { }

  ngOnInit(): void {
  }

  changeDefault() {

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
