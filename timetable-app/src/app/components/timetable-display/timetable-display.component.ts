import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-timetable-display',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule
  ],
  templateUrl: './timetable-display.component.html',
  styleUrls: ['./timetable-display.component.css'],
  providers: [provideAnimations()]
})
export class TimetableDisplayComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  dayColumns: string[] = [];
  days: number = 0;
  periods: number = 0;

  constructor(private router: Router, private timetableService: TimetableService) {}

  ngOnInit() {
    const tableStr = localStorage.getItem('timetableData');
    if (!tableStr) {
      this.router.navigate(['/']);
      return;
    }

    const table = JSON.parse(tableStr);
    this.days = table.days;
    this.periods = table.periods;
    this.dataSource.data = this.transformData(table.timetable);
    this.dayColumns = Array(this.days).fill(0).map((_, i) => `day${i + 1}`);
    this.displayedColumns = ['period', ...this.dayColumns];
  }

  transformData(timetable: string[][]): any[] {
    return timetable.map((row, index) => {
      const rowData: any = { period: `Period ${index + 1}` };
      row.forEach((subject, colIndex) => {
        rowData[`day${colIndex + 1}`] = subject;
      });
      return rowData;
    });
  }

  goBack() {
    this.router.navigate(['/subject-hours']);
  }

  regenerateTimetable() {
    const inputStr = localStorage.getItem('timetableInput');
    const totalHrsStr = localStorage.getItem('totalHours');
    if (!inputStr || !totalHrsStr) {
      this.router.navigate(['/']);
      return;
    }

    const input = JSON.parse(inputStr);
    const subjectsStr = localStorage.getItem('timetableData');
    const subjects = subjectsStr ? JSON.parse(subjectsStr).subjects : [];

    this.timetableService
      .generateTimetable({
        workingDays: input.workingDays,
        subjectsPerDay: input.subjectsPerDay,
        totalHours: Number(totalHrsStr),
        totalSubjects: input.totalSubjects,
        subjects: subjects
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('timetableData', JSON.stringify(res));
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error regenerating timetable:', err);
        }
      });
  }
}