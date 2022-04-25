import { TestBed } from '@angular/core/testing';

import { NotAuthGuard } from './not-auth-guard';
import {RouterTestingModule} from "@angular/router/testing";
import {MockProvider} from "ng-mocks";
import {LocalStorageService} from "../_services/local-storage.service";

describe('NotAuthGuardGuard', () => {
  let guard: NotAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        MockProvider(LocalStorageService)
      ]});
    guard = TestBed.inject(NotAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
