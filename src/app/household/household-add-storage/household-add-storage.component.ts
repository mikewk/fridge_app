import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "../../_graphql-services/storage.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {Household, QL_Storage} from "../../graphql.types";

/**
 * A simple component to add a storage to a household
 */
@Component({
  selector: 'app-household-add-storage',
  templateUrl: './household-add-storage.component.html',
  styleUrls: ['./household-add-storage.component.css']
})
export class HouseholdAddStorageComponent implements OnInit {
  name: string = "";
  type: string = "";
  household: Household;
  storage: QL_Storage;
  submitted = false;

  constructor(private route: ActivatedRoute,
              private localStorage: LocalStorageService) {
    this.household = this.localStorage.getHousehold()!;
    this.storage = {name: "", type: ""}
  }

  ngOnInit(): void {

  }
}
