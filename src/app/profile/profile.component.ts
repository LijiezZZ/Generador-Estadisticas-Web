import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChildActivationStart, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  user = JSON.parse(localStorage.getItem("user")!);
  userInfo = JSON.parse(localStorage.getItem("userInfo")!);
  formEdit!: FormGroup;
  showError: Boolean = false;
  editing: boolean = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formEdit = this.fb.group({
      usernameControl: new FormControl(this.userInfo["username"], [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      emailControl: new FormControl(this.user["email"], [Validators.required, Validators.email]),
      passwControl: new FormControl("", [Validators.minLength(6), Validators.maxLength(8)])
    })
  }

  edit() {
    this.editing = !this.editing;
  }

  myError = (controlName: string, errorName: string) =>{
    return this.formEdit.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.userInfo["username"] != this.formEdit.value["usernameControl"]) {
      this.userService.updateUserFromDB(this.userInfo["uid"], "username", this.formEdit.value["usernameControl"]);
      this.userInfo["username"] = this.formEdit.value["usernameControl"];
    }

    if (this.user["email"] != this.formEdit.value["emailControl"]) {
      this.userService.updateEmail(this.userInfo["uid"], this.formEdit.value["emailControl"]);
      this.user["email"] = this.formEdit.value["emailControl"];
    }
    if (this.formEdit.value["passwControl"] != "") {
      this.userService.updatePassword(this.userInfo["uid"], this.formEdit.value["passwControl"]);
    }

    localStorage.setItem("user", JSON.stringify(this.user));
    localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    alert("Cambios guardados!");
    this.edit();
  }

}
