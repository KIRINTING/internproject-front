import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLogForm } from './daily-log-form';

describe('DailyLogForm', () => {
  let component: DailyLogForm;
  let fixture: ComponentFixture<DailyLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyLogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLogForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
