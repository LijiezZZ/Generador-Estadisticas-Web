import { Injectable } from '@angular/core';
import { Auth, User as Usuario } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, observable, Observable, of as observableOf } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private auth: Auth) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.authState$.pipe(
      map(authState => {
        if (authState != null) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
          if (userInfo["type"] == "admin") {
            return true;
          }
          else {
            this.router.navigate(["/no-access"]);
            return false;
          }
        }
        this.router.navigate(["/login"]);
        return false;
      })
    );
    
  }
}
