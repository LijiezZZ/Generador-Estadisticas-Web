import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Chart as Chartjs} from 'chart.js/auto';
import { Papa } from 'ngx-papaparse';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{

  csvData!: any[];

  constructor(private userService: UserService, private router: Router, private papa: Papa) {
  }

  examples = ["bar", "h_bar", "s_bar", "line", "s_line", "pie", "doughnut", "area", "radar"];
  dataY = [
    [["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"]],
    [["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"]],
    [["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"],["1", "2", "3", "4", "5"]],
    [["1", "2", "3", "4", "5"], ["5", "4", "3", "2", "1"], ["3", "3", "3", "3", "3"], ["1", "8", "5", "3", "1"], ["1", "3", "5", "8", "1"]],
    [["1", "2", "3", "4", "5"], ["5", "4", "3", "2", "1"], ["3", "3", "3", "3", "3"], ["1", "2", "4", "6", "8"], ["8", "6", "4", "2", "1"]],
    [["1", "2", "3", "4", "5"]],
    [["1", "2", "3", "4", "5"]],
    [["1", "10", "6", "3", "0"], ["1", "8", "9", "3", "7"], ["10", "5", "3", "8", "9"], ["1", "2", "3", "4", "5"], ["5", "4", "3", "2", "1"]],
    [["10", "10", "10", "10", "10"], ["8", "8", "8", "8", "8"], ["5", "5", "5", "5", "5"], ["3", "3", "3", "3", "3"], ["1", "1", "1", "1", "1"]],
  ]
  chartData = {
    type: "bar",
    height: "400px",
    width: "300px",
    bgColor: "white",
    title: "Mi título",
    subtitle: "Mi subtítulo",
    titleX: "Título eje X",
    titleY: "Título eje Y",
    titleFontStyle: "normal",
    titleFontWeight: "normal",
    labelFontStyle: "normal",
    labelFontWeight: "normal",
    description: "Mi descripción",
    dataX: ["1", "2", "3", "4", "5"],
    dataY: [["1", "2", "3", "4", "5"]],
    legends: ["1", "2", "3", "4", "5"]
  };

  ngOnInit(): void {
    for (let i = 0; i < this.examples.length; i++) {
      this.chartData["type"] = this.examples[i];
      this.chartData["dataY"] = this.dataY[i];
      this.userService.createChart(this.examples[i], this.chartData);
    }
  }

  handleUpload($event: any) {
    const fileList = $event.srcElement.files;
    this.parseCsvFile(fileList[0]);
  }

  parseCsvFile(file: any) {
    this.papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      complete: (result) => {
        this.csvData = result.data;
        this.router.navigate(["/chart"], {state: {data: this.csvData}});
      }
    });
  }

/*   parseDataY() {
    let area = this.chartData["type"] == "area"? true : false;
    let bgColors = ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)'];
    let borderColors = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 159, 64)', 'rgb(153, 102, 255)'];
    let dataY = [];
    for (let i = 0; i < this.chartData["dataY"].length; i++) {
      dataY.push({
        label: "",
        data: this.chartData["dataY"][i],
        fill: area,
        backgroundColors: bgColors[i],
        borderColors: borderColors[i],
        borderWidth: 1
      });
    }
    this.chartData["type"] = area ? this.chartData["type"] = "line" : this.chartData["type"] = this.chartData["type"];
    return dataY;
   }*/

  userIsActive() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    if (userInfo == null || userInfo["active"] == true) {
      return true;
    }
    else {
      return false;
    }
  }

  userIsAdmin() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    if (userInfo != null && userInfo["type"] == "admin") {
      return true;
    }
    return false;
  }

}
