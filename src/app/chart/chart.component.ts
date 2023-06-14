import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Chart } from '../_models/chart.model';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit{

  formChart!: FormGroup;
  chartType = "bar";
  height = "400px";
  width = "500px";
  bgColor = "white";

  title = "";
  subtitle = "";
  titleX = "";
  titleY = "";

  titleFontStyle = "normal";
  titleFontWeight = "normal";
  labelFontStyle = "normal";
  labelFontWeight = "normal";
  
  description = "";

  textareaList: any = ["y1"];

  dataX: string[] = [];
  dataY: string[][] = [];

  leyendaList: any = ["l1"];
  legends: string[] = [];

  userInfo = JSON.parse(localStorage.getItem("userInfo")!);
  isPremium = this.userInfo["type"] == "basic"? true : false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.formChart = this.fb.group({
      x: new FormControl("", [Validators.required, Validators.pattern("^(.+\n)*.+$")]),
      y1: new FormControl("", [Validators.required, Validators.pattern("^([+-]?[0-9]+(\.[0-9]+)?\n)*[+-]?[0-9]+(\.[0-9]+)?$")]),
      l1: new FormControl("Leyenda1", [])
    })
  };

  onSubmit() {
    if (this.formChart.invalid) {
      console.log("datos invalidos!")
    }
    else {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);

      let uid = userInfo["uid"];
      let chartid = 0;

      if (userInfo["type"] == "normal") {
        if (userInfo["charts"] == 0) {
          chartid = new Date().getTime();
        }
        else {
          chartid = userInfo["charts"][0];
        }
      }
      else {
        chartid = new Date().getTime();
      }

      let date = new Date();
      let creationDate = this.datepipe.transform(date, "yyyy-MM-dd");

      let chart = new Chart(uid, chartid, creationDate, this.chartType, this.height, this.width, this.bgColor, this.title, this.subtitle, this.titleX, this.titleY, this.titleFontStyle, this.titleFontWeight, this.labelFontStyle, this.labelFontWeight, this.dataX, this.dataY, this.legends, this.description);
      //console.log(chart);
      this.router.navigate(["/result"], {state: {data: chart}});
    }
  }

  addTextarea() {
    //^([0-9]+\n)*[0-9]+$
    let dataY = "y"+ (this.textareaList.length + 1);
    let leyenda = "l" + (this.leyendaList.length + 1);
    this.formChart.addControl(dataY, new FormControl("", [Validators.required, Validators.pattern("^([+-]?[0-9]+(\.[0-9]+)?\n)*[+-]?[0-9]+(\.[0-9]+)?$")]));
    this.formChart.addControl(leyenda, new FormControl("Leyenda" + (this.leyendaList.length + 1), []));
    this.textareaList.push(dataY);
    this.leyendaList.push(leyenda);
    
    console.log(dataY);
  }

  removeTextarea(index:any) {
    let control = this.textareaList.splice(index, 1);
    this.formChart.removeControl(control);
    let control1 = this.leyendaList.splice(index, 1);
    this.formChart.removeControl(control);
  }

  dataIsCorrect() {
    let dataX = this.formChart.value.x.split("\n");
    let dataY = [];
    let legends = [];
    for (let i = 0; i < this.textareaList.length; i++) {
      let y = this.textareaList[i];
      let l = this.leyendaList[i];
      dataY.push(this.formChart.controls[y].value.split("\n"));
      legends.push(this.formChart.controls[l].value);
    }
    for (let y of dataY) {
      if (y.length != dataX.length) {
        return false;
      }
    }
    this.dataX = dataX;
    this.dataY = dataY;
    this.legends = legends;
    return true;
  }


}
