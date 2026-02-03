import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerDashboard } from './officer-dashboard';

describe('OfficerDashboard', () => {
  let component: OfficerDashboard;
  let fixture: ComponentFixture<OfficerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
