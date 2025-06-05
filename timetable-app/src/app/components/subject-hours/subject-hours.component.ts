import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimetableService } from '../../services/timetable.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-subject-hours',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './subject-hours.component.html',
  styleUrls: ['./subject-hours.component.css'],
  providers: [provideAnimations()]
})
export class SubjectHoursComponent implements OnInit {
  subjects = new MatTableDataSource<{ name: string; hours: number }>([]);
  totalHours: number = 0;
  totalSubjects: number = 0;
  valid: boolean = false;
  error: string = '';
  displayedColumnsWithIndex: string[] = ['index', 'name', 'hours', 'actions'];

  constructor(private service: TimetableService, private router: Router) {}

  ngOnInit() {
    const inputStr = localStorage.getItem('timetableInput');
    const totalHrsStr = localStorage.getItem('totalHours');

    if (!inputStr || !totalHrsStr) {
      this.router.navigate(['/']);
      return;
    }

    const input = JSON.parse(inputStr);
    this.totalHours = Number(totalHrsStr);
    this.totalSubjects = input.totalSubjects;

    this.subjects.data = Array(this.totalSubjects).fill(null).map(() => ({
      name: '',
      hours: 0,
    }));
  }

  get totalAssignedHours(): number {
    return this.subjects.data.reduce((sum, subj) => sum + Number(subj.hours || 0), 0);
  }

  onHoursChange(index: number, newHours: number) {
    if (newHours < 0) {
      this.subjects.data[index].hours = 0;
      this.onChange();
      return;
    }

    this.subjects.data[index].hours = newHours;
    this.onChange();
  }

  onChange() {
     const allNamesFilled = true;
    const allHoursPositive = this.subjects.data.every(s => s.hours > 0);
    const totalHoursMatch = this.totalAssignedHours === this.totalHours;
    const sufficientSubjects = this.subjects.data.length >= this.totalSubjects;

    this.valid = allNamesFilled && allHoursPositive && totalHoursMatch && sufficientSubjects;

    if (!this.valid) {
      if (!allNamesFilled) {
        this.error = 'All subjects must have a name.';
      } else if (!allHoursPositive) {
        this.error = 'All subjects must have positive hours.';
      } else if (!totalHoursMatch) {
        this.error = `Total assigned hours (${this.totalAssignedHours}) must match total hours (${this.totalHours}).`;
      } else if (!sufficientSubjects) {
        this.error = `At least ${this.totalSubjects} subjects are required.`;
      }
    } else {
      this.error = '';
    }
  }

  removeSubject(index: number) {
    this.subjects.data.splice(index, 1);
    this.subjects._updateChangeSubscription();
    this.onChange();
  }

  onGenerate() {
    if (!this.valid) {
      this.error = 'Please ensure all subjects have names, positive hours, and total hours match exactly.';
      return;
    }

    const input = JSON.parse(localStorage.getItem('timetableInput')!);

    this.service
      .generateTimetable({
        workingDays: input.workingDays,
        subjectsPerDay: input.subjectsPerDay,
        totalHours: this.totalHours,
        totalSubjects: this.totalSubjects,
        subjects: this.subjects.data,
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('timetableData', JSON.stringify(res));
          this.router.navigate(['/display']);
        },
        error: (err) => {
          this.error = 'Error generating timetable: ' + (err.error || 'Unknown error');
        },
      });
  }
}