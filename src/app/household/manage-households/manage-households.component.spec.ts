import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHouseholdsComponent } from './manage-households.component';

describe('ManageHouseholdsComponent', () => {
  let component: ManageHouseholdsComponent;
  let fixture: ComponentFixture<ManageHouseholdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHouseholdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHouseholdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
