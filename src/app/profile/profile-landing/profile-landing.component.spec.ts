import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileLandingComponent} from './profile-landing.component';

describe('ProfileComponentComponent', () => {
  let component: ProfileLandingComponent;
  let fixture: ComponentFixture<ProfileLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileLandingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
