import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,        
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,         
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class AppComponent {
  title = 'Dynamic Timetable Generator';
}
