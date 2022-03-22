import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdChangeDefaultComponent } from './household-change-default.component';

describe('HouseholdChangeDefaultComponent', () => {
  let component: HouseholdChangeDefaultComponent;
  let fixture: ComponentFixture<HouseholdChangeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdChangeDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdChangeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
