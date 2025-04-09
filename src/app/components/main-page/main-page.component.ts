import { Component, OnInit } from '@angular/core';
import { PointsService } from '../../../services/PointsService';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { PointFormComponent } from '../point-form/point-form.component';
import { GraphComponent } from '../graph/graph.component';
import { ResultsTableComponent } from '../results-table/results-table.component';
import { InteractiveBackgroundComponent } from '../interactive-background/interactive-background.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    PointFormComponent,
    GraphComponent,
    ResultsTableComponent,
    InteractiveBackgroundComponent,
    FormsModule
  ]
})
export class MainPageComponent implements OnInit {
  r: number = 1;
  points: any[] = [];
  results: any[] = [];

  constructor(private pointsService: PointsService) {}

  async fetchPoints() {
    try {
      const data = await firstValueFrom(this.pointsService.getPoints());
      this.points = data;
      this.results = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  ngOnInit() {
    this.fetchPoints();
  }

  async handleFormSubmit(data: any) {
    try {
      const result = await firstValueFrom(this.pointsService.submitPoint(data));
      this.points = [result, ...this.points];
      this.results = [result, ...this.results];
    } catch (error) {
      console.error('Error:', error);
    }
  }

  handleGraphClick(event: { x: number, y: number }) {
    this.handleFormSubmit({ x: event.x, y: event.y, r: this.r });
  }

  handleRChange(value: number) {
    this.r = value;
  }
}
