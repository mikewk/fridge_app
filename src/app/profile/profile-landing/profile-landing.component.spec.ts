import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileLandingComponent} from './profile-landing.component';
import {LocalStorageService} from "../../_services/local-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {UserService} from "../../_graphql-services/user.service";

import {RouterTestingModule} from "@angular/router/testing";
import {MockInstance, MockProvider} from "ng-mocks";

describe('ProfileLandingComponent', () => {
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
        MockProvider(UserService),
        MockProvider(MatSnackBar),
        MockProvider(DialogHelperService),
        MockProvider(LocalStorageService),
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    getUserSpy = jasmine.createSpy("getUser").and.returnValue({
      memberHouseholds: [
        {owner:{id:1}, location:"Test 1", name:"Test 1"},
        {owner:{id:2}, location:"Test 2", name:"Test 2"}
      ],
      ownedHouseholds: [],
      id:2}
    );
    MockInstance(LocalStorageService, ()=>({getUser: getUserSpy}));
    fixture = TestBed.createComponent(ProfileLandingComponent);
    component = fixture.componentInstance;
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
