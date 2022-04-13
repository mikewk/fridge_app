import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteComponent } from './invite.component';
import {RouterTestingModule} from "@angular/router/testing";
import {MockProvider} from "ng-mocks";
import {InviteService} from "../_graphql-services/invite.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../_services/local-storage.service";

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteComponent ],
      imports: [RouterTestingModule],
      providers: [
        MockProvider(InviteService),
        MockProvider(MatSnackBar),
        MockProvider(LocalStorageService)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
