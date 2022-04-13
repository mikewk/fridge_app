import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoodItemCardComponent} from './food-item-card.component';
import {FoodItemService} from "../../_graphql-services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ItemDialogService} from "../../_services/item-dialog.service";
import {MockProvider} from "ng-mocks";

const mockFoodItem = {
  id:0, name:"FoodItem1", entered:"2000-01-01 00:00:00", expiration: "2000-01-07 00:00:00",
  enteredBy: {id:0, name:"User1",  email:"", memberHouseholds: [], ownedHouseholds: []}, tags: ["tag1", "tag2"]
}

describe('FoodItemCardComponent', () => {
  let component: FoodItemCardComponent;
  let fixture: ComponentFixture<FoodItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodItemCardComponent],
      providers: [
        MockProvider(FoodItemService),
        MockProvider(MatSnackBar),
        MockProvider(ItemDialogService)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodItemCardComponent);
    component = fixture.componentInstance;
    component.foodItem = mockFoodItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
