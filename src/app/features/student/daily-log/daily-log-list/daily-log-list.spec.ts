import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLogList } from './daily-log-list';

describe('DailyLogList', () => {
  let component: DailyLogList;
  let fixture: ComponentFixture<DailyLogList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyLogList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLogList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
