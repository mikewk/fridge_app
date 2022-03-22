import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "../../_services/storage.service";

/**
 * A simple component to add a storage to a household
 */
@Component({
  selector: 'app-storage-add',
  templateUrl: './storage-add.component.html',
  styleUrls: ['./storage-add.component.css']
})
export class StorageAddComponent implements OnInit {
  name: string = "";
  type: string = "";
  householdId: number;
  storageId?: number;
  submitted = false;

  constructor(private storageService: StorageService, private route: ActivatedRoute) {
    this.householdId = Number(route.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {

  }

  /**
   * Create the storage in the household defined in householdId
   */
  createStorage(): void {
    let storage = {name: this.name, type: this.type};
    //Utilize storage service to try to add storage to this household
    this.storageService.addStorage(this.householdId, storage).subscribe(
      {
        next: data => {
          //If we don't have an error, update the storage ID
          if (data.storages) {
            this.submitted = true;
            this.storageId = data.storages[0].id;
          } else {
            //TODO: Handle errors more gracefully
            console.log(data.error)
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }

  /**
   * Clears out storage information and resets submitted to false so we can add another storage immediately
   */
  newStorage(): void {
    this.submitted = false;
    this.name = "";
    this.type = "";
    this.storageId = undefined;
  }
}
