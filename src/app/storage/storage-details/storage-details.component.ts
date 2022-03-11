import {Component, OnInit} from '@angular/core';
import {QL_Storage} from "../../graphql.types";
import {StorageService} from "../../_services/storage.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddFoodItemComponent} from "../../food-item/add-food-item/add-food-item.component";
import {FoodItemService} from "../../_services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-storage-details',
  templateUrl: './storage-details.component.html',
  styleUrls: ['./storage-details.component.css']
})
export class StorageDetailsComponent implements OnInit {
  currentStorage?: QL_Storage;

  constructor(private storageService: StorageService,
              private foodItemService: FoodItemService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getStorage(Number(this.route.snapshot.paramMap.get("id")));
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddFoodItemComponent,
      {
        width: '400px',
        data: {storage: this.currentStorage}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.currentStorage && this.currentStorage.id) {
        let foodItem = result;
        this.foodItemService.addFoodItem(this.currentStorage.id, foodItem).subscribe(
          {
            next: data => {
              console.log(data);
              if (data.addFoodItemToStorage) {
                this.snackBar.open("Food Item Added Successfully",
                  undefined,
                  {
                    duration: 2000,
                    panelClass: ['simple-snack-bar']
                  });
                if (this.currentStorage) {
                  this.currentStorage = Object.assign({}, this.currentStorage);
                  if (this.currentStorage.foodItems) {
                    this.currentStorage.foodItems = this.currentStorage.foodItems.concat(
                      data.addFoodItemToStorage.foodItems[0]);
                  } else {
                    this.currentStorage.foodItems = data.addFoodItemToStorage.foodItems;
                  }
                }
              } else {
                console.log(data);
              }
            },
            error: err => {
              console.log(err);
            }
          }
        );
      }
    });
  }

  getStorage(id: number): void {
    this.storageService.getStorage(id).subscribe(
      {
        next: data => {
          if (data.getStorage.storages) {
            this.currentStorage = data.getStorage.storages[0];
          } else {
            console.log(data);
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }
}
