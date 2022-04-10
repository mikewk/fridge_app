import {Component, Inject, OnInit} from '@angular/core';
import {Household, QL_Storage} from "../../graphql.types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-household-remove-storage',
  templateUrl: './household-remove-storage.component.html',
  styleUrls: ['./household-remove-storage.component.css']
})
export class HouseholdRemoveStorageComponent implements OnInit {
  household: Household;
  selectedStorage: QL_Storage;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.household = data.household;
    this.selectedStorage = this.household.storages![0];
  }

  ngOnInit(): void {
  }

}
