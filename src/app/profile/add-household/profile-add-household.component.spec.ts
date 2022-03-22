import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileAddHouseholdComponent} from './profile-add-household.component';

describe('HouseholdAddComponent', () => {
  let component: ProfileAddHouseholdComponent;
  let fixture: ComponentFixture<ProfileAddHouseholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAddHouseholdComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAddHouseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
