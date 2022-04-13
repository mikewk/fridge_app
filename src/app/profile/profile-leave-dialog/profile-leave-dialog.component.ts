import { Component, OnInit } from '@angular/core';
import {Household, User} from "../../graphql.types";
import {MatSnackBar} from "@angular/material/snack-bar";
import {first} from "rxjs";
import {AuthService} from "../../_graphql-services/auth.service";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-profile-leave-dialog',
  templateUrl: './profile-leave-dialog.component.html',
  styleUrls: ['./profile-leave-dialog.component.css']
})
export class ProfileLeaveDialogComponent implements OnInit {

  householdToLeave?: Household;
  households?: Household[];
  user?: User;

  constructor(private localStorage: LocalStorageService) {
  }

  ngOnInit(): void {
    this.user = this.localStorage.getUser();
    this.households = this.user?.memberHouseholds.filter(x=>x.owner!.id!=this.user!.id)
  }
}
