import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FoodItem, QL_Storage} from "../../graphql.types";
import {StorageService} from "../../_services/storage.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddFoodItemComponent} from "../../food-item/add-food-item/add-food-item.component";
import {FoodItemService} from "../../_services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxImageCompressService} from "ngx-image-compress"
import {EMPTY, mergeMap} from "rxjs";


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
              private snackBar: MatSnackBar,
              private imageCompress: NgxImageCompressService) {
  }

  ngOnInit(): void {
    this.getStorage(Number(this.route.snapshot.paramMap.get("id")));
  }

  openEditDialog(foodItem: FoodItem){
    const dialogRef = this.dialog.open(AddFoodItemComponent,
      {
        width: '400px',
        data: {storage: this.currentStorage, foodItem: foodItem}
      });

    dialogRef.afterClosed().pipe(mergeMap(
      (result)=>
        {
          //If we have a result, make the add food item call
          if (result) {
            return this.foodItemService.editFoodItem(result);
          }
          return EMPTY;
        })).subscribe({
          next: data => {
            //If the API call was successful
            if (data.updateFoodItem) {
              this.snackBar.open("Food Item Edited Successfully",undefined,
                          { duration: 2000, panelClass: ['simple-snack-bar']});
              //Update the component
              this.getStorage(this.currentStorage!.id!)
          } else {
            console.log(data);
          }
        },
        error: err => {
          console.log(err);
        }
      });
  }

  /**
   * Opens add/edit dialog in add mode
   */
  async openAddDialog() {

    this.imageCompress.uploadFile().then(
      ({image, orientation})=>{
        this.imageCompress.compressFile(image, orientation, undefined, 75, 1024, 1024, "image/jpeg").
          then( (compressedImage) => {
            return compressedImage;
        }).then((image)=>{
             const dialogRef = this.dialog.open(AddFoodItemComponent,
      {
              width: '400px',
              data: {storage: this.currentStorage, image: image}
            });

             dialogRef.afterClosed().pipe(mergeMap(
      (result)=> {
              //If we have a result, make the add food item call
              if (result) {
                return this.foodItemService.addFoodItem(this.currentStorage!.id!, result)
              }
              return EMPTY;
              }
            )).subscribe({
              next: data => {
                //If the API call was successful
                if (data.addFoodItemToStorage) {
                  this.snackBar.open("Food Item Added Successfully",undefined,
                              { duration: 2000, panelClass: ['simple-snack-bar']});
                  //Update the component with new info
                  this.getStorage(this.currentStorage!.id!);
                } else {
                  console.log(data);
                }
              },
              error: err => {
                console.log(err);
              }
            });
        })
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
