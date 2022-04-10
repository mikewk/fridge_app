import {Component, OnInit} from '@angular/core';
import {QL_Storage} from "../../graphql.types";

/**
 * A simple dialog to add a storage to a household
 */
@Component({
  selector: 'app-household-add-storage',
  templateUrl: './household-add-storage.component.html',
  styleUrls: ['./household-add-storage.component.css']
})
export class HouseholdAddStorageComponent implements OnInit {
  name: string = "";
  type: string = "";
  storage: QL_Storage;
  submitted = false;

  constructor() {
    this.storage = {name: "", type: ""}
  }

  ngOnInit(): void {

  }
}
