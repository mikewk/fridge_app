import {Component} from '@angular/core';
import {LocalStorageService} from './_services/local-storage.service';
import {Household, User} from "./graphql.types";
import {ItemDialogService} from "./_services/item-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  user?: User;
  selectedHousehold?: Household;
  constructor(private localStorageService: LocalStorageService,
              private addFoodItemHandler: ItemDialogService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.localStorageService.getToken();

    if (this.isLoggedIn) {
      //If we're logged in, keep trade of email, name, and user id to be used in other places
      this.user = this.localStorageService.getUser()!;
      this.selectedHousehold = this.localStorageService.getHousehold();
    }
  }

  /**
   * Log the user out by telling the token service to Mount Doom the token.
   */
  logout(): void {
    this.localStorageService.signOut();
    window.location.reload();
  }

  addItemToSelected() {
    if( this.selectedHousehold ) {
      this.addFoodItemHandler.addItem(this.selectedHousehold).subscribe(
        {
          next: data => {
            //If the API call was successful
            if (data.addFoodItemToStorage) {
              this.snackBar.open("Food Item Added Successfully", undefined,
                {duration: 2000, panelClass: ['simple-snack-bar']});
            } else {
              console.log(data);
            }
          },
          error: err => {
            console.log(err);
          }
        });
    }
  }

  changeSelected(household: Household) {
    this.localStorageService.saveHousehold(household);
    this.selectedHousehold = household;
    window.location.reload();
  }
}
