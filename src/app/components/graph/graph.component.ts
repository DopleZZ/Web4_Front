import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  standalone: true
})
export class GraphComponent implements AfterViewInit, OnChanges {
  @Input() r!: number;
  @Input() points: any[] = [];
  @Output() graphClick = new EventEmitter<{ x: number, y: number }>();

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    const context = this.canvasRef.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.drawGraph();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.ctx) {
      this.drawGraph();
    }
  }

  drawGraph() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = 300;
    const height = 300;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const minX = -5, maxX = 5, minY = -5, maxY = 5;
    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);

    const xToCanvas = (x: number) => (x - minX) * scaleX;
    const yToCanvas = (y: number) => (maxY - y) * scaleY;

    ctx.fillStyle = 'rgba(0, 113, 227, 0.1)';

    // Четверть окружности
    ctx.save();
    ctx.translate(xToCanvas(0), yToCanvas(0));
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.r * scaleX, 0, 0.5 * Math.PI, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Треугольник
    ctx.beginPath();
    ctx.moveTo(xToCanvas(0), yToCanvas(0));
    ctx.lineTo(xToCanvas(-this.r), yToCanvas(0));
    ctx.lineTo(xToCanvas(0), yToCanvas(this.r));
    ctx.closePath();
    ctx.fill();

    // Прямоугольник
    ctx.fillRect(xToCanvas(0), yToCanvas(0), -this.r * scaleX, (this.r / 2) * scaleY);

    // Сетка
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = minX; i <= maxX; i++) {
      ctx.beginPath();
      ctx.moveTo(xToCanvas(i), 0);
      ctx.lineTo(xToCanvas(i), height);
      ctx.stroke();
    }
    for (let i = minY; i <= maxY; i++) {
      ctx.beginPath();
      ctx.moveTo(0, yToCanvas(i));
      ctx.lineTo(width, yToCanvas(i));
      ctx.stroke();
    }

    // Оси
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xToCanvas(minX), yToCanvas(0));
    ctx.lineTo(xToCanvas(maxX), yToCanvas(0));
    ctx.moveTo(xToCanvas(0), yToCanvas(minY));
    ctx.lineTo(xToCanvas(0), yToCanvas(maxY));
    ctx.stroke();

    // Подписи
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = minX; i <= maxX; i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), xToCanvas(i), yToCanvas(0) + 5);
      }
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = minY; i <= maxY; i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), xToCanvas(0) - 5, yToCanvas(i));
      }
    }

    // Точки
    this.points.forEach(point => {
      const x = xToCanvas(point.x);
      const y = yToCanvas(point.y);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = point.hit ? 'rgba(52, 199, 89, 0.8)' : 'rgba(255, 59, 48, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    });
  }

  onCanvasClick(event: MouseEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const width = 300;
    const height = 300;
    const minX = -5, maxX = 5, minY = -5, maxY = 5;
    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const x = (event.clientX - rect.left) / scaleX + minX;
    const y = maxY - (event.clientY - rect.top) / scaleY;
    this.graphClick.emit({ x, y });
  }
}
