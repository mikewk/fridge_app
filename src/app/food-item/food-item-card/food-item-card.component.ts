import {Component, Input, OnInit} from '@angular/core';
import {FoodItem} from "../../graphql.types";
import {FoodItemService} from "../../_services/food-item.service";

@Component({
  selector: 'food-item-card',
  templateUrl: './food-item-card.component.html',
  styleUrls: ['./food-item-card.component.css']
})
export class FoodItemCardComponent implements OnInit {
  @Input() foodItem!: FoodItem;
  constructor(private foodItemService:FoodItemService) { }

  ngOnInit(): void {
  }


  openDeleteDialog(foodItem: FoodItem)
  {
    if(confirm("Are you sure?"))
    {
      this.foodItemService.removeFoodItem(foodItem).subscribe(
        {
          next: data=> {
            if( data.removeFoodItem && data.removeFoodItem.success)
            {
              // TODO: Figure out how to trigger refresh of parent
            }
          },
          error: err => {
            console.log(err);
          }
        }
      );
    }
  }


}
