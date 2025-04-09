import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ResultsTableComponent {
  @Input() results: any[] = [];

  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  get totalPages(): number {
    return Math.ceil(this.results.length / this.pageSize);
  }

  get paginatedResults(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.results.slice(startIndex, startIndex + this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.results.length);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }
}
