import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {Household} from "../../graphql.types";


/**
 * Material Dialog component for adding and editing food items
 */
@Component({
  selector: 'app-add-household',
  templateUrl: './household-add.component.html',
  styleUrls: ['./household-add.component.css']
})
export class HouseholdAddComponent implements OnInit {
  household: Household;
  addOnBlur = true;
  editing = false;
  snackBarRef?: MatSnackBarRef<any>;
  readonly separatorKeyCodes = [ENTER, COMMA, SPACE] as const;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      //Make a copy of the household
      this.household = Object.assign({}, data.household);
      //If we have a household, we're editing
      this.editing = true;
    } else {
      //No household?  Create one and we're not editing
      this.household = {name: "", location: ""};
      this.editing = false;
    }
  }

  ngOnInit(): void {
  }
}
