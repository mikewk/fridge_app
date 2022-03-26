import {Component, OnInit} from '@angular/core';
import {Household} from "../../graphql.types";


/**
 * Material Dialog component for adding a household
 */
@Component({
  selector: 'app-profile-add-household',
  templateUrl: './profile-add-household.component.html',
  styleUrls: ['./profile-add-household.component.css']
})
export class ProfileAddHouseholdComponent implements OnInit {
  household: Household = {name: "", location: "", id:-1};

  constructor() {
  }

  ngOnInit(): void {
  }
}
