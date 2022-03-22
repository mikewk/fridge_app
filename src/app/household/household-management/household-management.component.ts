import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HouseholdService} from "../../_graphql-services/household.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-household-management',
  templateUrl: './household-management.component.html',
  styleUrls: ['./household-management.component.css']
})
export class HouseholdManagementComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private householdService: HouseholdService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  inviteUser() {

  }

  removeUser() {

  }

  removeHousehold() {

  }

  editHousehold() {

  }


  addStorage() {

  }

  editStorage() {

  }

  removeStorage() {

  }
}
