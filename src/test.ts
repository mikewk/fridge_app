// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {MockInstance, MockService, ngMocks} from 'ng-mocks';
import {Apollo} from "apollo-angular";
import {APOLLO_TESTING_CLIENTS} from "apollo-angular/build/testing/module";
import {ApolloCache} from "@apollo/client/cache";
import {LocalStorageService} from "./app/_services/local-storage.service";
import {BehaviorSubject} from "rxjs";

ngMocks.autoSpy('jasmine');

ngMocks.defaultMock(LocalStorageService, ()=>(
  {
    selectedHouseholdId: new BehaviorSubject<number | undefined>(undefined)
  }
));

// auto restore for jasmine and jest <27
// declare const jasmine: any;
jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
