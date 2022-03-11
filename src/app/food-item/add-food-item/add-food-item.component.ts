import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import {QL_Storage} from "../../types";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";

export interface AddFoodItem {
  name: string;
  tags: string[];
}

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.css']
})
export class AddFoodItemComponent implements OnInit {
  foodItem: AddFoodItem = {name: "", tags: []};
  addOnBlur = true;
  editing = false;
  storage: QL_Storage;
  readonly separatorKeyCodes = [ENTER, COMMA, SPACE] as const;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.foodItem) {
      this.foodItem = data.foodItem;
      this.editing = true;
    }
    this.storage = data.storage;
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.foodItem.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(value: string): void {
    const index = this.foodItem.tags.indexOf(value);

    if (index >= 0) {
      this.foodItem.tags.splice(index, 1);
    }
  }

}
