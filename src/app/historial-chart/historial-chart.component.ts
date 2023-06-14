import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-historial-chart',
  templateUrl: './historial-chart.component.html',
  styleUrls: ['./historial-chart.component.css']
})
export class HistorialChartComponent implements OnInit{

  chartData: any;
  
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.chartData = history.state.data;
    this.userService.createChart("myChart", this.chartData);
  }

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
}
