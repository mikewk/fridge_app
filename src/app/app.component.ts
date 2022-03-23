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
  userType: string =  "";

  constructor(private localStorageService: LocalStorageService,
              private addFoodItemHandler: ItemDialogService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.localStorageService.getToken();
    this.localStorageService.userType.subscribe(x=>{this.userType=x; console.log("Usertype Changed to "+x);});

    if (this.isLoggedIn) {
      //If we're logged in, get our user from localstorage
      this.user = this.localStorageService.getUser()!;
      //And our selected household
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

  /**
   * Show the add item dialog if the Add Item icon is clicked in the toolbar
   * Can be called from anywhere as long as there is a selected household
   */
  addItemToSelected() {
    if (this.selectedHousehold) {
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

  /**
   * Change the selected household to the household picked in the menu
   * @param household
   */
  changeSelected(household: Household) {
    this.localStorageService.saveHousehold(household);
    this.selectedHousehold = household;
    window.location.reload();
  }
}
