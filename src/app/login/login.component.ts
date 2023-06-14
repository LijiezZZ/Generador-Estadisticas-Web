import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formLogin!: FormGroup;
  showError: Boolean = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      emailControl: new FormControl("", [Validators.required, Validators.email]),
      passwControl: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(8)])
    })
  };

  myError = (controlName: string, errorName: string) =>{
    return this.formLogin.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    let email = this.formLogin.value.emailControl;
    let password = this.formLogin.value.passwControl;

    if (this.formLogin.invalid) {
      console.log("datos invalidos!")
    }
    else {
      this.userService.login(email, password)
      .then(response => {
        this.showError = false;
        /* this.userService.getUserFromDB(email).subscribe((user) => {
          if (localStorage.getItem("user") != "null") {
            localStorage.setItem("userInfo", JSON.stringify({"username":user[0]["username"], "type":user[0]["type"], "active":user[0]["active"]}));
            JSON.parse(localStorage.getItem("userInfo")!);
          }
          else {
            localStorage.setItem("userInfo", "null");
            JSON.parse(localStorage.getItem("userInfo")!);
          }
          
        }) */
        this.router.navigate(["/"]);
      })
      .catch(error => {
        this.showError = true;
        console.log(error)
      });
    }
  }
}
