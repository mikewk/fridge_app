import { Component, OnInit } from '@angular/core';
import {Household, Invite} from "../../graphql.types";
import {LocalStorageService} from "../../_services/local-storage.service";
import {HouseholdService} from "../../_graphql-services/household.service";

@Component({
  selector: 'app-household-add-invite',
  templateUrl: './household-add-invite.component.html',
  styleUrls: ['./household-add-invite.component.css']
})
export class HouseholdAddInviteComponent implements OnInit {
  household?: Household;
  error: boolean = false;
  invite: Invite;
  copy: boolean = false;
  constructor(private localStorage: LocalStorageService,
              private householdService: HouseholdService)
  {
    this.householdService.getHousehold(this.localStorage.selectedHouseholdId.getValue()!).subscribe(
      (data)=>
      {
        if( data.households )
        {
          this.household=data.households[0];
        }
        else
        {
          this.error = true;
        }
      }
    );
    this.invite = {message:"", id:"", householdName:"", inviteeName:"", status:0, inviterName:""};
  }

  ngOnInit(): void {
  }


}
