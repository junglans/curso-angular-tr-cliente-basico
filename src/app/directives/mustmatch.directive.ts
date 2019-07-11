import { Directive, Input } from '@angular/core';
import { MustMatch } from '../validators/mustmatch.validator';
import {NG_VALIDATORS, Validator, FormGroup, ValidationErrors } from '@angular/forms';
// The directive implements the Validator interface and registers itself with the NG_VALIDATORS
// provider to let angular know that it's a custom validator directive. NG_VALIDATORS contains 
// the built-in custom validator
@Directive({
  selector: '[mustMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true }] //MIRAR
})
export class MustMatchDirective implements Validator {
  
  @Input() mustMatch: string[] = [];
  constructor() { }
  
  validate(formGroup: FormGroup): ValidationErrors {
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }

  registerOnValidatorChange?(fn: () => void): void {}

}
