import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/validators/mustmatch.validator';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsRegistrationComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted: boolean = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        title: new FormControl('',[ Validators.required ],[]),
        firstName: ['', [ Validators.required ],''],
        lastName: ['', [ Validators.required ], []],
        email: ['', [ Validators.required, Validators.email ],[]],
        password: ['', [Validators.required, Validators.minLength(6)], []],
        confirmPassword: ['', [ Validators.required ], []],
        acceptTerms: [false, [ Validators.requiredTrue], []]
    },{ 
      validator: MustMatch('password', 'confirmPassword')
    });

    this.registerForm.controls.firstName.statusChanges.subscribe((state: string) => {
        console.log('firstName state: ' + state);
        console.log('firstName dirty: ' + this.registerForm.controls.firstName.dirty);
        console.log('firstName pristine: ' + this.registerForm.controls.firstName.pristine);
        
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  public onSubmit(): void {
    this.submitted = true;
    if (!this.registerForm.invalid) {
      console.log('SUCCESS!! :-)\n\n' + JSON.stringify( this.registerForm.value ));
    }
    
  }

  public onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
}
