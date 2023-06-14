import { Component, Input, OnInit } from '@angular/core';
import { Chart as Chartjs} from 'chart.js/auto';
import { UserService } from '../services/user.service';
import { jsPDF } from 'jspdf';
import { Chart } from '../_models/chart.model'


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit{

  chart: any;
  chartData: any;
  plugin: any;
  btnClicked: Boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {

    this.chartData = history.state.data;
    console.log("datos del grafico recibido en pagina result", this.chartData);
    this.userService.createChart("myChart", this.chartData);
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
  } */

  saveAsPNG() {
    const imageLink = document.createElement("a");
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;
    imageLink.download = "mi-grafico.png";
    imageLink.href = canvas.toDataURL("image/png", 1);
    imageLink.click();
    alert("Gráfico descargado!");
  }

  saveAsPDF() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const image = canvas.toDataURL('image/jpeg', 1.0);
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    const marginX = (pageWidth - canvasWidth) / 2;
    const marginY = (pageHeight - canvasHeight) / 2;

    doc.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
    doc.save('mi-grafico.pdf');
    alert("Gráfico descargado!");
  }

  saveToDB() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    let dataY = [];
    for (let i = 0; i < this.chartData["dataY"].length; i++) {
      dataY.push({
        "data": this.chartData["dataY"][i]
      })
    }

    let chartData = new Chart(this.chartData["uid"], this.chartData["chartid"], this.chartData["date"], this.chartData["type"], this.chartData["height"], this.chartData["width"], this.chartData["bgColor"], this.chartData["title"], this.chartData["subtitle"], this.chartData["titleX"], this.chartData["titleY"], this.chartData["titleFontStyle"], this.chartData["titleFontWeight"], this.chartData["labelFontStyle"], this.chartData["labelFontWeight"], this.chartData["dataX"], dataY, this.chartData["legends"], this.chartData["description"]);
    
    if (userInfo["charts"].length == 0) {
      let list = [this.chartData["chartid"]];
      this.userService.registerChartToDB(Object.assign({},chartData));
      this.userService.updateUserFromDB(userInfo["uid"], "charts", list);
      userInfo["charts"] = list;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      alert("Gráfico guardado en tu historial!");
    }
    else {
      if (userInfo["type"] == "premium") {
        let list = userInfo["charts"];
        list.push(this.chartData["chartid"]);
        this.userService.registerChartToDB(Object.assign({},chartData));
        this.userService.updateUserFromDB(userInfo["uid"], "charts", list);
        userInfo["charts"] = list;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        alert("Gráfico guardado en tu historial!");
      }
      else {
        this.userService.updateChartToDB(userInfo["uid"], Object.assign({},chartData));
        alert("Gráfico guardado en tu historial!");
      }
    }

    this.btnClicked = true;
  }

}
