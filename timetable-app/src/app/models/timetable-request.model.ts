import { SubjectHour } from './subject-hour.model';

export interface TimetableRequest {
  workingDays: number;
  subjectsPerDay: number;
  totalHours: number;
  totalSubjects: number;
  subjects: SubjectHour[];
}
