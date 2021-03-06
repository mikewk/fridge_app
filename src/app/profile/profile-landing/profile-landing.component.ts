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
import {ChangePasswordDialogComponent} from "../change-password-dialog/change-password-dialog.component";
import {ChangeUsernameDialogComponent} from "../change-username-dialog/change-username-dialog.component";
import {take} from "rxjs";

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
              this.localStorage.refreshToken().pipe(take(1)).subscribe();
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

  /**
   * Show a dialog to pick a household to leave
   * Only shows households of which the user is NOT the owner
   */
  leaveHousehold()
  {
    this.dialogHelper.launchDialog(ProfileLeaveDialogComponent,
                                  (x: any) => this.userService.leaveHousehold(x)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.success) {
          this.localStorage.refreshToken().pipe(take(1)).subscribe();
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

  /**
   * Show change password dialog
   */
  changePassword() {
    this.dialogHelper.launchDialog(ChangePasswordDialogComponent,
                                  (x: any) => this.userService.changePassword(x.oldPassword, x.password)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.token) {
          this.localStorage.saveToken(data.token);
          this.snackBar.open("Password Changed Successfully", undefined,
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

  /**
   * Show change name dialog
   */

  changeName() {

  }

  /**
   * Show change username dialog
   */
  changeUsername() {
    this.dialogHelper.launchDialog(ChangeUsernameDialogComponent,
                                  (x: any) => this.userService.changeUsername(x.newUsername, x.password)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.token) {
          this.localStorage.saveToken(data.token);
          this.snackBar.open("Username Changed Successfully", undefined,
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
}
