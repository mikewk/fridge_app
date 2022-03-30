import {Component, Inject, OnInit} from '@angular/core';
import {Household} from "../../graphql.types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-household-remove-household',
  templateUrl: './household-remove-household-dialog.component.html',
  styleUrls: ['./household-remove-household-dialog.component.css']
})
export class HouseholdRemoveHouseholdDialogComponent implements OnInit {
  ownedHouseholds: Household[]
  selectedHousehold?: Household;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService) {
    this.ownedHouseholds = data.ownedHouseholds;
  }

  ngOnInit(): void {
  }

}
