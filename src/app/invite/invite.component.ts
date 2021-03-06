import { Component, OnInit } from '@angular/core';
import {Household, Invite} from "../graphql.types";
import {ActivatedRoute, Router} from "@angular/router";
import {InviteService} from "../_graphql-services/invite.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../_services/local-storage.service";

/**
 * Some strings that should be moved into some global area to be easily changed out / i18n
 */
const CanSee = ["Your name", "Activity in this household"];
const CanNotSee = ["Your email", "Households you have created",
                   "Other households of which you're a member", "Activity in any other households"];

/**
 * The page shown when a user follows an invite link
 */
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  invite?: Invite;
  error: String = "";
  canSee: String[] = CanSee;
  canNotSee: String[] = CanNotSee;
  rejected: boolean = false;
  accepted: boolean = false;
  tokenRefresh?: boolean
  household?: Household;
  constructor(private route: ActivatedRoute,
              private inviteService: InviteService,
              private snackBar: MatSnackBar,
              private localStorage: LocalStorageService,
              private router: Router) { }

  /**
   * Get the ID field from the URL and try to get the invite from the server
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if ( id ) {
      this.inviteService.getInvite(id).subscribe({
        next: data => {
          if( data.invites )
          {
            this.invite = data.invites[0];
          }
          else {
            this.error = "Not Found";
            console.log(data.error);
          }
        }
      })
    }
  }

  /**
   * Change the household if the user clicks the button
   */
  changeHousehold() {
    if( this.household ) {
      const userId = this.localStorage.getUser()!.id;
      let userType = "member";
      if( userId == this.household.owner!.id)
        userType = "owner";
      this.localStorage.switchHousehold(this.household.id, userType);
      this.router.navigate(["dashboard"]);
    }
  }

  /**
   * Reject the currently displayed invite
   */
  reject() {
    this.inviteService.rejectInvite(this.invite!).subscribe({
      next: data => {
        if( data.error ) {
          this.snackBar.open("Rejection failed. Try Again.", undefined, {panelClass:"simple-snack-bar", duration:2000});
        }
        else {
          this.snackBar.open("Rejection successful.", undefined, {panelClass:"simple-snack-bar", duration:2000});
          this.rejected = true;
          this.invite = undefined;
        }
      }
    });
  }

  /**
   * Try to accept the currently displayed invite
   */
  accept() {
    const userId = this.localStorage.getUser()!.id;
    this.inviteService.acceptInvite(this.invite!).subscribe({
      next: data => {
        if( data.error || !data.households) {
          this.snackBar.open("Accept failed. Try Again.", undefined, {panelClass:"simple-snack-bar", duration:2000});
        }
        else {
          //If an invite is accepted, we need to get a new token ASAP
          this.localStorage.refreshToken().subscribe(success=>{
              this.tokenRefresh = success;
          });
          this.snackBar.open("Accept successful.", undefined, {panelClass:"simple-snack-bar", duration:2000});
          this.household = data.households[0];
          this.accepted = true;
        }
      }
    });
  }
}
