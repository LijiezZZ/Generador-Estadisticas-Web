import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialChartComponent } from './historial-chart.component';

describe('HistorialChartComponent', () => {
  let component: HistorialChartComponent;
  let fixture: ComponentFixture<HistorialChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
