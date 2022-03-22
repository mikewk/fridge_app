import { Injectable } from '@angular/core';
import {ComponentType} from "@angular/cdk/overlay";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogHelperService {

  constructor(private dialog: MatDialog) { }

  launchDialog(dialog: ComponentType<any>, modelCallback: Function, data?: any) : Observable<any>
  {
    const dialogRef = this.dialog.open(dialog,
    {
      width: '400px',
      data: data
    });

    //This is a hack, but a proper solution was voted down
    //See: https://github.com/angular/components/issues/7471
    if (dialogRef['_overlayRef'].overlayElement) {
    dialogRef['_overlayRef'].overlayElement.parentElement.className += ' dialog-wrapper';
    }

   return dialogRef.afterClosed().pipe(mergeMap(
      (result)=> {
          //If we have a result, make the add food item call
          if (result) {
            return modelCallback(result);
          } else {
            return EMPTY;
          }
        })
     );
  }
}
