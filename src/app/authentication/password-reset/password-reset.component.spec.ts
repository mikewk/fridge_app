import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import {MockProvider} from "ng-mocks";
import {AuthService} from "../../_graphql-services/auth.service";
import {FormsModule} from "@angular/forms";
import {LocalStorageService} from "../../_services/local-storage.service";
import {RouterTestingModule} from "@angular/router/testing";

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetComponent ],
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        MockProvider(AuthService),
        MockProvider(LocalStorageService)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
