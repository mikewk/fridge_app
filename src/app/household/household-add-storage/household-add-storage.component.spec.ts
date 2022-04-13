import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HouseholdAddStorageComponent} from './household-add-storage.component';
import {FormsModule} from "@angular/forms";

describe('StorageAddComponent', () => {
  let component: HouseholdAddStorageComponent;
  let fixture: ComponentFixture<HouseholdAddStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseholdAddStorageComponent],
      imports: [FormsModule]
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
