import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileChangeDefaultComponent} from './profile-change-default.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../../_services/local-storage.service";
import {MockInstance, MockProvider} from "ng-mocks";

describe('ProfileChangeDefaultComponent', () => {
  let component: ProfileChangeDefaultComponent;
  let fixture: ComponentFixture<ProfileChangeDefaultComponent>;
  let getUserSpy: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileChangeDefaultComponent],
      providers: [
        MockProvider(LocalStorageService)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    getUserSpy = jasmine.createSpy("getUser").and.returnValue({
      memberHouseholds: [{name:"Test1", id:1}, {name:"Test2", id:2}],
      defaultHousehold: 1
    })
    MockInstance(LocalStorageService, "getUser", getUserSpy);
    fixture = TestBed.createComponent(ProfileChangeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser', () => {
    expect(getUserSpy).toHaveBeenCalled();
  });
});
