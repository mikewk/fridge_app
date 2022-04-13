import {TestBed} from '@angular/core/testing';

import {DefaultGuard} from './default.guard';
import {RouterTestingModule} from "@angular/router/testing";
import {MockProvider} from "ng-mocks";
import {LocalStorageService} from "../_services/local-storage.service";

describe('DefaultGuard', () => {
  let guard: DefaultGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({   imports:
      [
        RouterTestingModule,
      ],
      providers:[
        MockProvider(LocalStorageService)
      ]});
    guard = TestBed.inject(DefaultGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
