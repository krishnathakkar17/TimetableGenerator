import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectHoursComponent } from './subject-hours.component';

describe('SubjectHoursComponent', () => {
  let component: SubjectHoursComponent;
  let fixture: ComponentFixture<SubjectHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
