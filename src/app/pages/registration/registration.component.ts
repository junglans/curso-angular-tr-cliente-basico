import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  public model: Model = new Model();
  public options: string[] = ['Sr.', 'Sra.', 'Srta'];
  constructor() { }

  ngOnInit() {
  }

  public onSubmit(): void {
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
  }

  public getOptions(): string[] {
    return this.options;
  }
}
export class Model {
  public title: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public acceptTerms: boolean;
}