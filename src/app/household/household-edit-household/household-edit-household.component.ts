import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Household} from "../../graphql.types";

@Component({
  selector: 'app-household-edit-household',
  templateUrl: './household-edit-household.component.html',
  styleUrls: ['./household-edit-household.component.css']
})
export class HouseholdEditHouseholdComponent implements OnInit {
  household: Household;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.household = Object.assign({}, data.household);
  }

  ngOnInit(): void {
  }

}
