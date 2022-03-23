import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveStorageComponent } from './household-remove-storage.component';

describe('HouseholdRemoveStorageComponent', () => {
  let component: HouseholdRemoveStorageComponent;
  let fixture: ComponentFixture<HouseholdRemoveStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdRemoveStorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdRemoveStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
