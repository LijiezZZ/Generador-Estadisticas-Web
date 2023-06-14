import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  formRegister!: FormGroup;
  showError: Boolean = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      usernameControl: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      emailControl: new FormControl("", [Validators.required, Validators.email]),
      passwControl: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    })
  }

  myError = (controlName: string, errorName: string) =>{
    return this.formRegister.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    let username = this.formRegister.value.usernameControl;
    let email = this.formRegister.value.emailControl;
    let password = this.formRegister.value.passwControl;
    let charts: any[] = [];

    if (this.formRegister.invalid) {
      console.log(this.formRegister.value)
    }
    else {
      this.userService.register(username, email, password).then(
        response => {
          let uid = response.user.uid;
          console.log(response);
          let user = new User(uid, username, email, password, "basic", true, charts);
          this.userService.registerUserToDB(Object.assign({}, user));
          this.showError = false;
          alert("Registrado!");
          this.router.navigate(["/login"]);
      })
      .catch(
        error => {
          console.log(error);
          this.showError = true;
        });
    }
  }
}
