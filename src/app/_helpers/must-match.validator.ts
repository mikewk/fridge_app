import {FormGroup} from "@angular/forms";

/**Ensure that the values in two password controls match and add and error to the 2nd if they don't */
export function MustMatch(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    //Get controls
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    //If either control doesn't exist, do nothing
    if (!control || !matchingControl)
      return;
    //If the control already has errors and they're not a matching error, do nothing
    if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
      return;
    }

    //Check if control values match, if they don't, set an error
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
    } else {
      //If they do match, then clear any existing mustMatch error
      matchingControl.setErrors(null);
    }
  };
}
