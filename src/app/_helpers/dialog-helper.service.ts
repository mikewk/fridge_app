import {Injectable} from '@angular/core';
import {ComponentType} from "@angular/cdk/overlay";
import {EMPTY, mergeMap, Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

/**
 * This service helps abstract away a lot of the dialog handling code.
 * It opens the dialog, sets the data field if it exists, hacks the overlay element, and calls the callback
 * If the dialog action is selected
 */
@Injectable({
  providedIn: 'root'
})
export class DialogHelperService {

  constructor(private dialog: MatDialog) {
  }

  /**
   * Launch the dialog, injecting data if it exists.  Take the returned object and call it with modelCallback
   * @param dialog
   * @param modelCallback
   * @param data
   */
  launchDialog(dialog: ComponentType<any>, modelCallback: Function, data?: any): Observable<any> {
    //Open a dialog
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

    //Return the Observable of the dialog closing and the result going through the callback
    return dialogRef.afterClosed().pipe(mergeMap(
      (result) => {
        console.log(result);
        //If we have a result, call the callback
        if (result) {
          return modelCallback(result);
        } else {
          return EMPTY;
        }
      })
    );
  }
}
