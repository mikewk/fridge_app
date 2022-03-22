import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileChangeDefaultComponent} from './profile-change-default.component';

describe('HouseholdChangeDefaultComponent', () => {
  let component: ProfileChangeDefaultComponent;
  let fixture: ComponentFixture<ProfileChangeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileChangeDefaultComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileChangeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
