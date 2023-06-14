import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  users: User[] = [];

  displayedColumns: string[] = ['uid', 'username', 'email', 'password', 'type', 'active', 'charts', 'acciones'];
  dataSource: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsersFromDB().subscribe(response => {
      this.users = [];
      for (let user of response) {
        this.users.push(user as User);
      }
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeUserState(uid: string, username: string, active: boolean) {

    if (confirm("Seguro de cambiar el estado del usuario: " + username + "?")) {
      this.userService.updateUserFromDB(uid, "active", !active);
    }
  }

  changeUserType(uid: string, username: string, type: string) {
    if (confirm("Seguro de cambiar el tipo del usuario: " + username + "?")) {
      let newType = type == "basic"? "premium" : "basic";
      this.userService.updateUserFromDB(uid, "type", newType);
    }
  }

  getUserHistorial(uid: string, charts: any) {
    localStorage.setItem("received_charts", JSON.stringify(charts));
    localStorage.setItem("received_uid", uid);
    this.router.navigate(["/historial"]);
  }

  deleteUser(uid: string, username: string) {
    if (confirm("Seguro de eliminar este usuario de forma permanente: " + username + "?")) {
      this.userService.deleteUserFromDB(uid);
    }
  }

}
