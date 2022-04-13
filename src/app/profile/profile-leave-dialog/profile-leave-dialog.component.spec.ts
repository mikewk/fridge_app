import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeaveDialogComponent } from './profile-leave-dialog.component';
import {LocalStorageService} from "../../_services/local-storage.service";
import {MockInstance, MockProvider} from "ng-mocks";


describe('ProfileLeaveDialogComponent', () => {
  let component: ProfileLeaveDialogComponent;
  let fixture: ComponentFixture<ProfileLeaveDialogComponent>;
  let getUserSpy: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLeaveDialogComponent ],
      providers: [MockProvider(LocalStorageService)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    getUserSpy = jasmine.createSpy("getUser").and.returnValue({
        memberHouseholds: [
          {owner:{id:1}, location:"Test 1", name:"Test 1"},
          {owner:{id:2}, location:"Test 2", name:"Test 2"}
        ],
        id:2});
    MockInstance(LocalStorageService, ()=>({
      getUser: getUserSpy}));
    fixture = TestBed.createComponent(ProfileLeaveDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser()', () => {
    expect(getUserSpy).toHaveBeenCalled();
  })

  it('should list test 1', () => {
    expect(component.households?.length).toBe(1);
    expect(component.households![0]?.name).toBe("Test 1");
  })
  it('should not list test 2', () => {
    expect(component.households?.length).toBe(1);
    expect(component.households![0]?.name).not.toBe("Test 2");
  })
});
