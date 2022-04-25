import {Component, Inject, OnInit} from '@angular/core';
import {Household, QL_Storage} from "../../graphql.types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-household-edit-storage',
  templateUrl: './household-edit-storage.component.html',
  styleUrls: ['./household-edit-storage.component.css']
})
export class HouseholdEditStorageComponent implements OnInit {

  selectedStorage?: QL_Storage;
  storages: QL_Storage[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.storages = data.household.storages.map((x:QL_Storage)=>Object.assign({}, x));
  }

  ngOnInit(): void {

  }

}
