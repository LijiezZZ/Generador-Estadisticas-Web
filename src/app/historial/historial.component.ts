import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit{

  charts: any[] = [];
  order: string = "desc";
  
  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCharts(localStorage.getItem("received_uid"));
  }

  getCharts(received_uid: any) {
    if (received_uid == null) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      this.userService.getChartFromDB(userInfo["uid"], this.order).subscribe(response => {
        this.charts = [];
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          let dataY = [];
          for (let j = 0; j < response[i]["dataY"].length; j++) {
            dataY.push(response[i]["dataY"][j]["data"]);
          }
          this.charts.push(response[i]);
          this.charts[i]["dataY"] = dataY;
        }
      });
    }
    else {
      this.userService.getChartFromDB(received_uid, this.order).subscribe(response => {
        this.charts = [];
        for (let i = 0; i < response.length; i++) {
          let dataY = [];
          for (let j = 0; j < response[i]["dataY"].length; j++) {
            dataY.push(response[i]["dataY"][j]["data"]);
          }
          this.charts.push(response[i]);
          this.charts[i]["dataY"] = dataY;
        }
      })
    }
  }

  chipSelected(value: any) {
    this.order = value;
    this.getCharts(localStorage.getItem("received_uid"));
  }

  visualizeChart(index: any) {
    this.router.navigate(["/historial-chart"], {state: {data: this.charts[index]}})
  }

  deleteChart(index: any) {
    if (localStorage.getItem("received_uid") == null) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      if (confirm("Seguro de borrar este gráfico?")) {
        let position = userInfo["charts"].indexOf(this.charts[index]["chartid"]);
        if (position != -1) {
          userInfo["charts"].splice(position, 1);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let userInfo2 = JSON.parse(localStorage.getItem("userInfo")!);
        this.userService.deleteChart(this.charts[index]["uid"], this.charts[index]["chartid"]);
        this.userService.updateUserFromDB(userInfo2["uid"], "charts", userInfo["charts"]);
      }
    }
    else {
      if (confirm("Seguro de borrar este gráfico?")) {
        let charts = JSON.parse(localStorage.getItem("received_charts")!);
        let position = charts.indexOf(this.charts[index]["chartid"]);
        if (position != -1) {
          charts.splice(position, 1);
          localStorage.setItem("received_charts", JSON.stringify(charts));
        }
        let userInfo2 = JSON.parse(localStorage.getItem("received_charts")!);
        this.userService.deleteChart(this.charts[index]["uid"], this.charts[index]["chartid"]);
        this.userService.updateUserFromDB(this.charts[index]["uid"], "charts", userInfo2);
      }
    }
    
  }

  /* ngOnInit(): void {
    this.getCharts();
  }

  getCharts() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    this.userService.getChartFromDB(userInfo["uid"], this.order).subscribe(response => {
      this.charts = [];
      console.log(response);
      for (let i = 0; i < response.length; i++) {
        let dataY = [];
        for (let j = 0; j < response[i]["dataY"].length; j++) {
          dataY.push(response[i]["dataY"][j]["data"]);
        }
        this.charts.push(response[i]);
        this.charts[i]["dataY"] = dataY;
      }
    });
  }
  
  changeOrder() {
    if (this.order == "desc") {
      this.order = "asc";
    }
    else {
      this.order = "desc";
    }
    this.getCharts();
  }

  visualizeChart(index: any) {
    this.router.navigate(["/historial-chart"], {state: {data: this.charts[index]}})
  }

  deleteChart(index: any) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    if (confirm("Seguro de borrar este gráfico?")) {
      let position = userInfo["charts"].indexOf(this.charts[index]["chartid"]);
      if (position != -1) {
        userInfo["charts"].splice(position, 1);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      let userInfo2 = JSON.parse(localStorage.getItem("userInfo")!);
      this.userService.deleteChart(this.charts[index]["uid"], this.charts[index]["chartid"]);
      this.userService.updateUserFromDB(userInfo2["uid"], "charts", userInfo["charts"]);
    }
  } */
}
