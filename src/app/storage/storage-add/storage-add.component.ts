import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'app-storage-add',
  templateUrl: './storage-add.component.html',
  styleUrls: ['./storage-add.component.css']
})
export class StorageAddComponent implements OnInit {
  name: string = "";
  type: string = "";
  id: number;
  storageId?: number;
  submitted = false;

  constructor(private storageService: StorageService, private route: ActivatedRoute) {
    this.id = Number(route.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {

  }

  createStorage(): void {
    let storage = {name: this.name, type: this.type};
    this.storageService.addStorage(this.id, storage).subscribe(
      {
        next: data => {
          if (!data.addStorageToHousehold.error) {
            this.submitted = true;
            this.storageId = data.addStorageToHousehold.storages[0].id;
          } else {
            console.log(data.addStorageToHousehold.error)
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }

  newStorage(): void {
    this.submitted = false;
    this.name = "";
    this.type = "";
    this.storageId = undefined;
  }
}
