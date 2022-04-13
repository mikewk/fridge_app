import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileChangeDefaultComponent} from './profile-change-default.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {localStorageSpy, snackBarSpy} from "../../_mocks/service-spies";
import {LocalStorageService} from "../../_services/local-storage.service";

describe('ProfileChangeDefaultComponent', () => {
  let component: ProfileChangeDefaultComponent;
  let fixture: ComponentFixture<ProfileChangeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileChangeDefaultComponent],
      providers: [
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: LocalStorageService, useValue: localStorageSpy}
      ]
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
