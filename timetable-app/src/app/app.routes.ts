// src/app/app.routes.ts
import { TimetableFormComponent } from './components/timetable-form/timetable-form.component';
import { SubjectHoursComponent } from './components/subject-hours/subject-hours.component';
import { TimetableDisplayComponent } from './components/timetable-display/timetable-display.component';

export const routes = [
  { path: '', component: TimetableFormComponent },
  { path: 'subject-hours', component: SubjectHoursComponent },
  { path: 'display', component: TimetableDisplayComponent },
  { path: '**', redirectTo: '' },
];
