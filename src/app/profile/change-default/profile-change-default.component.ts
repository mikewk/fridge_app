import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from "@angular/material/snack-bar";

import {Household, User} from "../../graphql.types";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-change-default',
  templateUrl: './profile-change-default.component.html',
  styleUrls: ['./profile-change-default.component.css']
})
export class ProfileChangeDefaultComponent implements OnInit {
  defaultHousehold?: Household;
  households: Household[];
  user: User;

  constructor(private snackBar: MatSnackBar,
              private storageService: LocalStorageService) {
    this.user = this.storageService.getUser()!;
    this.defaultHousehold = this.user.defaultHousehold;
    this.households = this.user.memberHouseholds;
  }

  ngOnInit(): void {
  }

  compareHouseholds(a: Household, b: Household): boolean {
    return a.id == b.id;
  }

}
