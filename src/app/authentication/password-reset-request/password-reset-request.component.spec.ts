import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetRequestComponent } from './password-reset-request.component';
import {MockProvider} from "ng-mocks";
import {AuthService} from "../../_graphql-services/auth.service";
import {FormsModule} from "@angular/forms";

describe('PasswordResetRequestComponent', () => {
  let component: PasswordResetRequestComponent;
  let fixture: ComponentFixture<PasswordResetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetRequestComponent ],
      imports: [FormsModule],
      providers: [
        MockProvider(AuthService),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
