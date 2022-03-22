import {Component, Inject, OnInit} from '@angular/core';
import {Household, User} from "../../graphql.types";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FoodItemService} from "../../_services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../../_services/local-storage.service";

@Component({
  selector: 'app-household-change-default',
  templateUrl: './household-change-default.component.html',
  styleUrls: ['./household-change-default.component.css']
})
export class HouseholdChangeDefaultComponent implements OnInit {
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

  compareHouseholds(a: Household, b: Household): boolean
  {
    return a.id==b.id;
  }

}
