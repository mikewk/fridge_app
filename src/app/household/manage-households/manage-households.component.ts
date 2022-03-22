import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HouseholdService} from "../../_services/household.service";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-manage-households',
  templateUrl: './manage-households.component.html',
  styleUrls: ['./manage-households.component.css']
})
export class ManageHouseholdsComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private householdService: HouseholdService,
              private snackBar: MatSnackBar) { }

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
