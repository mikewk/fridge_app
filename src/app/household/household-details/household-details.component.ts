import {Component, OnInit} from '@angular/core';
import {HouseholdService} from "../../_services/household.service";
import {ActivatedRoute} from "@angular/router";
import {Household} from "../../types";

@Component({
  selector: 'app-household-details',
  templateUrl: './household-details.component.html',
  styleUrls: ['./household-details.component.css']
})
export class HouseholdDetailsComponent implements OnInit {
  currentHousehold?: Household;

  constructor(private householdService: HouseholdService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getHousehold(Number(this.route.snapshot.paramMap.get("id")));
  }

  getHousehold(id: number): void {
    this.householdService.getHousehold(id).subscribe(
      {
        next: data => {
          if (data.getHousehold.households) {
            this.currentHousehold = data.getHousehold.households[0];
          } else {
            console.log(data);
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }
}
