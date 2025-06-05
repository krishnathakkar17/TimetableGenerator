import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimetableService } from '../../services/timetable.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-timetable-form',
  templateUrl: './timetable-form.component.html',
  styleUrl : './timetable-form.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule, MatTableModule, MatFormFieldModule, MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSortModule],
})
export class TimetableFormComponent {
  form: FormGroup;
  totalHours: number = 0;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private service: TimetableService,
    private router: Router
  ) {
    this.form = this.fb.group({
      workingDays: [null, [Validators.required, Validators.min(1), Validators.max(7)]],
      subjectsPerDay: [null, [Validators.required, Validators.min(1), Validators.max(8)]],
      totalSubjects: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Please enter valid inputs.';
      return;
    }

    const formValue = this.form.value as {
      workingDays: number,
      subjectsPerDay: number,
      totalSubjects: number
    };

    this.service.calculateTotalHours(formValue).subscribe({
      next: (res) => {
        this.totalHours = res.totalHours;
        localStorage.setItem('timetableInput', JSON.stringify(formValue));
        localStorage.setItem('totalHours', this.totalHours.toString());
        this.router.navigate(['/subject-hours']);
      },
      error: () => {
        this.error = 'Error calculating total hours. Check backend.';
      },
    });
  }
}
