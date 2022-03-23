import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HouseholdAddStorageComponent} from './household-add-storage.component';

describe('StorageAddComponent', () => {
  let component: HouseholdAddStorageComponent;
  let fixture: ComponentFixture<HouseholdAddStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseholdAddStorageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdAddStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
