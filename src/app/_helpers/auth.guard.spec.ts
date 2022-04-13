import {TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {RouterTestingModule} from "@angular/router/testing";
import {MockProvider} from "ng-mocks";
import {LocalStorageService} from "../_services/local-storage.service";

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({   imports:
      [
        RouterTestingModule,
      ],
      providers:[
        MockProvider(LocalStorageService)
      ]});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
