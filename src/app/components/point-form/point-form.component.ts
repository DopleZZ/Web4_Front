import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PointFormComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() rChange = new EventEmitter<number>();

  x: number | null = null;
  y: string = '';
  r: number | null = null;
  errors: { [key: string]: string } = {};

  xValues: number[] = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
  rValues: number[] = [0.5, 1, 1.5, 2];

  validate() {
    const errors: { [key: string]: string } = {};
    if (this.x === null) {
      errors['x'] = 'Выберите значение X';
    }
    const yNumber = parseFloat(this.y);
    if (isNaN(yNumber)) {
      errors['y'] = 'Y должен быть числом';
    } else if (yNumber < -5 || yNumber > 5) {
      errors['y'] = 'Y должен быть в диапазоне от -5 до 5';
    }
    if (this.r === null) {
      errors['r'] = 'Выберите значение R';
    } else if (parseFloat(this.r.toString()) <= 0) {
      errors['r'] = 'R должно быть положительным числом';
    }
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  onSubmit() {
    if (this.validate()) {
      this.formSubmit.emit({ x: parseFloat(this.x!.toString()), y: parseFloat(this.y), r: parseFloat(this.r!.toString()) });
    }
  }

  selectX(value: number) {
    this.x = value;
  }

  selectR(value: number) {
    this.r = value;
    this.rChange.emit(value);
  }
}
