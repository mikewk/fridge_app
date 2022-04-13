import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileLandingComponent} from './profile-landing.component';
import {LocalStorageService} from "../../_services/local-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {UserService} from "../../_graphql-services/user.service";
import {Router} from "@angular/router";
import {snackBarSpy, localStorageSpy, dialogHelperSpy, routerSpy, userSpy} from "../../_mocks/service-spies"
import {RouterTestingModule} from "@angular/router/testing";

describe('ProfileComponentComponent', () => {
  let component: ProfileLandingComponent;
  let fixture: ComponentFixture<ProfileLandingComponent>;
  let getUserSpy: any;
  /**
   * private userService: UserService,
   *               private snackBar: MatSnackBar,
   *               private dialogHelper: DialogHelperService,
   *               private localStorage: LocalStorageService,
   *               private router: Router
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileLandingComponent],
      imports: [RouterTestingModule],
      providers:[
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: LocalStorageService, useValue: localStorageSpy },
        {provide: DialogHelperService, useValue: dialogHelperSpy},
        {provide: UserService, useValue: userSpy}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLandingComponent);
    component = fixture.componentInstance;
    getUserSpy = localStorageSpy.getUser.and.returnValue({
      memberHouseholds: [
        {owner:{id:1}, location:"Test 1", name:"Test 1"},
        {owner:{id:2}, location:"Test 2", name:"Test 2"}
        ],
      ownedHouseholds: [],
      id:2});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser()', () =>
  {
    expect(getUserSpy).toHaveBeenCalled();
  })
});
