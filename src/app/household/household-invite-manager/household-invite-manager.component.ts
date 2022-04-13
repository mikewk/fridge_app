import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InviteService} from "../../_graphql-services/invite.service";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {HouseholdAddInviteComponent} from "../household-add-invite/household-add-invite.component";
import {Clipboard} from "@angular/cdk/clipboard";
import {LocalStorageService} from "../../_services/local-storage.service";
import {NEVER, switchMap} from "rxjs";
import {Invite} from "../../graphql.types";

const InformationList = [
  "All links are one-time use.",
  "If your invitee accepts, their name will appear in the table",
  "Unused links will expire in 30 days.",
  "Accepted, Rejected, and Expired entries automatically delete after 30 days."
];


/**
 * Displays status of existing invites and allows for creation of new invites
 */
@Component({
  selector: 'app-household-invite-manager',
  templateUrl: './household-invite-manager.component.html',
  styleUrls: ['./household-invite-manager.component.css']
})
export class HouseholdInviteManagerComponent implements OnInit {
  baseUrl: string = environment.invite_base_url;
  invites?: Invite[];
  copy: boolean = false;
  displayedColumns = ['status', 'invitee', 'message', 'get_link', 'delete'];
  status: string[] = ["Waiting", "Accepted", "Rejected", "Rescinded", "Expired"];
  information: string[] = InformationList;
  householdId?: number;

  constructor(private clipboard: Clipboard,
              private snackBar: MatSnackBar,
              private dialogHelper: DialogHelperService,
              private inviteService: InviteService,
              private localStorage: LocalStorageService) {

  }

  /**
   * Get the invites for this household on init
   */
  ngOnInit(): void {
     this.localStorage.selectedHouseholdId.pipe(switchMap(householdId=>
     {
       if( householdId ) {
         this.householdId = householdId;
         return this.inviteService.getInvites(householdId);
       }
       else {
         return NEVER;
       }
     })).subscribe({
        next: data=> {
          if( data.invites ) {
            this.invites = data.invites;
          }
          else {
            console.log(data.error);
     }}});
  }

  /**
   * Copies the invite URL to clipboard
   * @param invite
   */
  onCopy(invite: Invite)
  {
    if(this.clipboard.copy(this.baseUrl+"invite/"+invite.id)) {
      this.snackBar.open("Invite Link Copied!", undefined, {duration: 2000, panelClass:"simple-snack-bar"});
    }
  }

  /**
   * Use the default confirmation dialog on delete
   * @param invite
   */
  confirmDelete(invite: Invite) {
    if (confirm("Are you sure?")) {
      this.inviteService.deleteInvite(invite, this.householdId!).subscribe(
        {
          next: data => {
            if (!data.error) {
              this.snackBar.open("Invite Removed Successfully", undefined,
                {duration: 2000, panelClass: ['simple-snack-bar']});
            }
          },
          error: err => {
            console.log(err);
          }
        }
      );
    }
  }

  /**
   * Launches the add invite dialog
   */
  createInvite() {
    this.copy = false;
    this.dialogHelper.launchDialog(HouseholdAddInviteComponent, (x:any)=>{
      this.copy = x.copy;
      return this.inviteService.createInvite(x.invite, x.household)}).subscribe({
        next: data =>
        {
          console.log(data);
          if( data.invites ) {
            if( this.copy ) {
              this.onCopy(data.invites[0]);
              this.snackBar.open("Invite Created and Copied to Clipboard", undefined,
                                {duration:2000, panelClass:"simple-snack-bar"});
            }
            else {
              this.snackBar.open("Invite Created Successfully", undefined,
                                {duration:2000, panelClass:"simple-snack-bar"});
            }
          }
          else {
            console.log(data.error);
          }
        }
      }
    );
  }
}
