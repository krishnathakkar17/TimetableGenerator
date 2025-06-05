import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimetableInput } from '../models/timetable-input.model';
import { TimetableRequest } from '../models/timetable-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimetableService {
   private baseUrl = 'https://localhost:7012/api/timetable';

  constructor(private http: HttpClient) {}

  calculateTotalHours(data: TimetableInput): Observable<{ totalHours: number }> {
    return this.http.post<{ totalHours: number }>(
      `${this.baseUrl}/calculate-total-hours`,
      data
    );
  }

  generateTimetable(data: TimetableRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-timetable`, data);
  }
}
