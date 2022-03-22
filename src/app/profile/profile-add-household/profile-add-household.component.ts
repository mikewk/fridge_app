import {Component, Inject, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";

import {Household} from "../../graphql.types";


/**
 * Material Dialog component for adding and editing food items
 */
@Component({
  selector: 'app-profile-add-household',
  templateUrl: './profile-add-household.component.html',
  styleUrls: ['./profile-add-household.component.css']
})
export class ProfileAddHouseholdComponent implements OnInit {
  household: Household = {name: "", location: ""};
  snackBarRef?: MatSnackBarRef<any>;
  readonly separatorKeyCodes = [ENTER, COMMA, SPACE] as const;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }
}
