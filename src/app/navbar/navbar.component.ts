import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{


  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
  }

  userIsLogged() {
    const user = JSON.parse(localStorage.getItem("user")!);
    return user != null? true : false
  }

  getUsername() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    return userInfo != null? userInfo.username : null;
  }

  //fix navigation to homepage
  //fix historial -> take(1), call getChart() after delete chart
  //todo import file to create chart
  logout() {
    this.userService.logout();
    this.router.navigate(["/"]);
  }

  isAdmin() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    return userInfo != null && userInfo["type"] == "admin" ? true : false;
  }

  isPremium() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    return userInfo != null && userInfo["type"] == "premium" ? true : false;
  }
  
}

