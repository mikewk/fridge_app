import {Directive, Input} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

import {MustMatch} from './must-match.validator';

/**This class creates a directive for the MustMatch validator
 * MustMatch is used to ensure both passwords are the same at signup
 * */
@Directive({
  selector: '[mustMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true}]
})
export class MustMatchDirective implements Validator {
  @Input('mustMatch') mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    // @ts-ignore
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
