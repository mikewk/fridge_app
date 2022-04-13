import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from "@angular/material/snack-bar";

import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {ProfileChangeDefaultComponent} from "../change-default/profile-change-default.component";
import {UserService} from "../../_graphql-services/user.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {ProfileAddHouseholdComponent} from "../profile-add-household/profile-add-household.component";
import {Household, User} from "../../graphql.types";
import {ProfileLeaveDialogComponent} from "../profile-leave-dialog/profile-leave-dialog.component";
import {Router} from "@angular/router";
import {AuthService} from "../../_graphql-services/auth.service";

/**
 * Landing page for profile management
 */
@Component({
  selector: 'app-profile-landing',
  templateUrl: './profile-landing.component.html',
  styleUrls: ['./profile-landing.component.css']
})
export class ProfileLandingComponent implements OnInit {
  user? :User;
  moreThanOneHousehold: boolean = false;
  redirectAfterAdd: boolean = false;
  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              private dialogHelper: DialogHelperService,
              private localStorage: LocalStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.localStorage.getUser();
    if (this.user && this.user.memberHouseholds.length > 1) {
      this.moreThanOneHousehold = true;
    }
  }


  /**
   * Show the change default dialog and handle the result
   */
  changeDefault() {
    this.dialogHelper.launchDialog(ProfileChangeDefaultComponent,
      (x: any) => this.userService.changeDefault(x, this.user!.id)).subscribe({
      next: data => {
        if (data.households[0]) {
          this.snackBar.open("Default Household Changed Successfully", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
        } else {
          console.log(data);
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  /**
   * Add a new household with the current user as the owner
   */
  addHousehold() {
    this.dialogHelper.launchDialog(ProfileAddHouseholdComponent,
      ({household, redirect}: {household:Household, redirect:boolean}) => {
        this.redirectAfterAdd = redirect;
        return this.userService.addHousehold(household);
      })
      .subscribe({
          next: data => {
            //If the API call was successful
            if (data.households) {
              this.localStorage.refreshToken().subscribe();
              this.snackBar.open("Household Added Successfully", undefined,
                {duration: 2000, panelClass: ['simple-snack-bar']});
              if( this.redirectAfterAdd )
              {
                this.localStorage.switchHousehold(data.households[0].id, "owner")
                this.router.navigate(["/manage"]);
              }
            } else {
              console.log(data);
            }
          },
          error: err => {
            console.log(err);
          }
       });

  }

  leaveHousehold()
  {
    this.dialogHelper.launchDialog(ProfileLeaveDialogComponent,
                                  (x: any) => this.userService.leaveHousehold(x)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.success) {
          this.localStorage.refreshToken().subscribe();
          this.snackBar.open("Left Household Successfully", undefined,
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
