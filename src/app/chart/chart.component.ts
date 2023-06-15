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

  csvData: any;
  editable = true;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.csvData = history.state.data;
    
    if (this.csvData != undefined) {
      let parsedData = this.parseCSV(this.csvData);
      this.leyendaList = [];
      this.textareaList = [];
      this.formChart = this.fb.group({
        x: new FormControl(parsedData[0], [Validators.required, Validators.pattern("^(.+\n)*.+$")]),
      })
      console.log("hay csv");
      console.log(this.parseCSV(this.csvData));

      for (let i = 0; i < parsedData[parsedData.length - 1].length; i++) {
        this.formChart.addControl("l" + (this.leyendaList.length + 1), new FormControl(parsedData[parsedData.length - 1][i], [Validators.required]));
        this.leyendaList.push("l" + (this.leyendaList.length + 1))
      }
      for (let j = 1; j < parsedData.length - 1; j ++) {
        this.formChart.addControl("y" + (this.textareaList.length + 1), new FormControl(parsedData[j], [Validators.required, Validators.pattern("^([+-]?[0-9]+(\.[0-9]+)?\n)*[+-]?[0-9]+(\.[0-9]+)?$")]));
        this.textareaList.push("y" + (this.textareaList.length + 1));
      }
      this.editable = false;
    }
    else {
      console.log("no hay csv");
      this.formChart = this.fb.group({
        x: new FormControl("", [Validators.required, Validators.pattern("^(.+\n)*.+$")]),
        y1: new FormControl("", [Validators.required, Validators.pattern("^([+-]?[0-9]+(\.[0-9]+)?\n)*[+-]?[0-9]+(\.[0-9]+)?$")]),
        l1: new FormControl("Leyenda1", [])
      })
      this.editable = true;
    }
  };

  parseCSV(csv: any) {
    let result = [];
    let keys = Object.keys(this.csvData[0]);
    let position = keys.indexOf("");
    keys.splice(position, 1);
    let dataX: string[] = [""];
    for (let i = 0; i < this.csvData.length; i++) {
      if (i < this.csvData.length - 1) {
        dataX[0] = dataX[0] + this.csvData[i][""] + "\n";
      }
      else {
        dataX[0] = dataX[0] + this.csvData[i][""];
      }
    }
    result.push(dataX);
    let dataY: string[] = [""];
    let legends: string[] = [];
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < this.csvData.length; j++) {
        if (j < this.csvData.length - 1) {
          dataY[0] = dataY + this.csvData[j][keys[i]] + "\n";
        }
        else {
          dataY[0] = dataY + this.csvData[j][keys[i]];
        }
      }
      legends.push(keys[i]);
      result.push(dataY);
      dataY = [""];
    }
    result.push(legends);
    return result;
  }

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
    this.formChart.addControl(leyenda, new FormControl("Leyenda" + (this.leyendaList.length + 1), [Validators.required]));
    this.textareaList.push(dataY);
    this.leyendaList.push(leyenda);
  }

  removeTextarea(index:any) {
    let control = this.textareaList.splice(index, 1);
    this.formChart.removeControl(control);
    let control1 = this.leyendaList.splice(index, 1);
    this.formChart.removeControl(control1);
  }

  dataIsCorrect() {
    if (this.editable) {
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
    else {
      let parsedData = this.parseCSV(this.csvData);
      let dataX;
      let dataY = [];
      let legends = [];
      dataX = (parsedData[0][0].split("\n"));
      
      for (let i = 1; i < parsedData.length - 1; i++) {
        dataY.push(parsedData[i][0].split("\n"));
      }
      
      for (let j = 0; j < parsedData[parsedData.length - 1].length; j++) {
        legends.push(parsedData[parsedData.length - 1][j]);
      }

      this.dataX = dataX;
      this.dataY = dataY;
      this.legends = legends;

      return true;
    }
  }


}
