import { Component, OnInit } from '@angular/core';
import {Household, Invite} from "../../graphql.types";
import {LocalStorageService} from "../../_services/local-storage.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-household-add-invite',
  templateUrl: './household-add-invite.component.html',
  styleUrls: ['./household-add-invite.component.css']
})
export class HouseholdAddInviteComponent implements OnInit {
  household: Household;
  invite: Invite;
  copy: boolean = false;
  constructor(private localStorage: LocalStorageService)
  {
    this.household = this.localStorage.getHousehold()!;
    this.invite = {message:"", id:"", householdName:"", inviteeName:"", status:0, inviterName:""};
  }

  ngOnInit(): void {
  }


}
