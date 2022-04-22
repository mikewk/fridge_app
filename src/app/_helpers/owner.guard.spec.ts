import { TestBed } from '@angular/core/testing';

import { OwnerGuard } from './owner.guard';
import {LocalStorageService} from "../_services/local-storage.service";
import {RouterTestingModule} from "@angular/router/testing";
import {MockProvider} from "ng-mocks";

describe('OwnerGuard', () => {
  let guard: OwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:
      [
        RouterTestingModule,
      ],
      providers:[
        MockProvider(LocalStorageService)
      ]
    });
    guard = TestBed.inject(OwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
