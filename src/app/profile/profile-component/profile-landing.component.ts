import { Component, OnInit } from '@angular/core';
import {ComponentType} from "@angular/cdk/overlay";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {HouseholdService} from "../../_services/household.service";
import {HouseholdAddComponent} from "../household-add/household-add.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-landing.component.html',
  styleUrls: ['./profile-landing.component.css']
})
export class ProfileLandingComponent implements OnInit {

  constructor(private householdService: HouseholdService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
              ) { }

  ngOnInit(): void {
  }

  changeDefault() {

  }

  addHousehold() {
     this.launchDialog(HouseholdAddComponent, (x:any)=>this.householdService.addHousehold(x)) .subscribe({
      next: data => {
        //If the API call was successful
        if (data.changeDefaultHousehold) {
          this.snackBar.open("Default Changed Successfully",undefined,
                      { duration: 2000, panelClass: ['simple-snack-bar']});
        } else {
          console.log(data);
        }
      },
      error: err => {
        console.log(err);
      }
     });

  }
  launchDialog(dialog: ComponentType<any>, modelCallback: Function) : Observable<any>
  {
    const dialogRef = this.dialog.open(dialog,
    {
      width: '400px'
    });

   return dialogRef.afterClosed().pipe(mergeMap(
      (result)=> {
          //If we have a result, make the add food item call
          if (result) {
            return modelCallback(result);
          } else {
            return EMPTY;
          }
        })
     );
  }


  changeName() {

  }

  changeUserPass() {

  }
}
