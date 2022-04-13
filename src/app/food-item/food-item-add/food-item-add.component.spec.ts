import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoodItemAddComponent} from './food-item-add.component';
import {FoodItemService} from "../../_graphql-services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MockProvider} from "ng-mocks";
import {FormsModule} from "@angular/forms";
import {EMPTY} from "rxjs";

const mockData = {
  width: "400px",
  household: {storages:[{id:0}]}
}

describe('FoodItemAddComponent', () => {
  let component: FoodItemAddComponent;
  let fixture: ComponentFixture<FoodItemAddComponent>;
  // Later on we can use this to push other data for it to handle and test response
  let getSuggestionsSpy = jasmine.createSpy("getSuggestions").and.returnValue(EMPTY);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodItemAddComponent],
      imports: [FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData},
        MockProvider(FoodItemService, {
          getSuggestions: getSuggestionsSpy
        }),
        MockProvider(MatSnackBar),
        MockProvider(MatDialogRef)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
