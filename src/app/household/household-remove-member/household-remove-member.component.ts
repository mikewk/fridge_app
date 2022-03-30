import {Component, Inject, OnInit} from '@angular/core';
import {Household, QL_Storage, User} from "../../graphql.types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-household-remove-member',
  templateUrl: './household-remove-member.component.html',
  styleUrls: ['./household-remove-member.component.css']
})
export class HouseholdRemoveMemberComponent implements OnInit {

  household: Household;
  selectedUser?: User;
  userList: User[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService) {
    let userId = this.localStorage.getUser()!.id;
    this.household = data.household;
    this.userList = this.household.users!.filter(x=>x.id!=userId);
  }

  userCompare(a: User, b: User): boolean
  {
    return a?.id === b?.id;
  }

  ngOnInit(): void {

  }
}
