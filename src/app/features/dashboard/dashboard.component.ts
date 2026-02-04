import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InfoService, Info } from '../officer/services/info.service';
import { ProcessTrackerComponent } from './components/process-tracker.component';
import { InternshipService, InternshipRequest } from '../internship/services/internship';
import { AuthService } from '../../auth/auth.service';

interface CalendarDay {
  date: Date;
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  events?: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProcessTrackerComponent],
  providers: [DatePipe],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-banner animate-fade-in">
        <h2>Welcome back, Student</h2>
        <p>Stay updated with the latest internship news and schedule.</p>
      </div>

      <!-- Process Tracker -->
      <app-process-tracker [internshipStatus]="internshipData?.status || null"></app-process-tracker>

      <!-- Internship Info Card -->
      <div class="internship-info-card glass-panel animate-fade-in" *ngIf="internshipData && (internshipData.status === 'dean_approved' || internshipData.status === 'officer_approved')" style="animation-delay: 0.05s">
        <div class="section-header">
           <h3><span class="icon">🏢</span> ข้อมูลสถานประกอบการ</h3>
        </div>
        <div class="info-content">
            <div class="info-row">
                <div class="info-group">
                    <label>สถานประกอบการ</label>
                    <p>{{ internshipData.company_name }}</p>
                </div>
                <div class="info-group">
                    <label>ตำแหน่งงาน</label>
                    <p>{{ internshipData.position }}</p>
                </div>
             </div>
             <div class="info-row">
                <div class="info-group full-width">
                    <label>ที่อยู่</label>
                    <p>{{ internshipData.company_address }}</p>
                </div>
             </div>
             <div class="info-row">
                <div class="info-group">
                    <label>ผู้ประสานงาน</label>
                    <p>{{ internshipData.coordinator_name }} ({{ internshipData.coordinator_phone }})</p>
                </div>
                <div class="info-group">
                     <label>เบอร์โทรศัพท์บริษัท</label>
                    <p>{{ internshipData.company_phone }}</p>
                </div>
             </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- News Section -->
        <div class="news-section glass-panel animate-fade-in" style="animation-delay: 0.1s">
          <div class="section-header">
            <h3><span class="icon">📰</span> ข่าวสารและประกาศ</h3>
          </div>

          <div class="news-list">
            <div class="news-card" *ngFor="let item of newsItems">
              <div class="news-date">
                <span class="date-day">{{ item.due_date | date:'dd' }}</span>
                <span class="date-month">{{ item.due_date | date:'MMM' }}</span>
              </div>
              <div class="news-content">
                <span class="badge" [class.badge-announce]="item.category === 'Announce'"
                      [class.badge-important]="item.category === 'Important'"
                      [class.badge-guide]="item.category === 'Guide'">{{ item.category }}</span>
                <h4>{{ item.title }}</h4>
                <p>{{ item.detail }}</p>
              </div>
            </div>
            <div *ngIf="newsItems.length === 0" class="no-news"><p>ยังไม่มีข่าวสารในขณะนี้</p></div>
          </div>
        </div>

        <!-- Calendar Section -->
        <div class="calendar-section glass-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="section-header">
            <h3><span class="icon">📅</span> ปฏิทิน</h3>
          </div>
          <div class="calendar-header">
            <span>{{ currentMonth | date:'MMMM yyyy' }}</span>
          </div>
          
          <div class="calendar-grid">
            <div class="weekday" *ngFor="let day of weekdays">{{ day }}</div>
          </div>

          <div class="calendar-days">
            <div class="calendar-day" *ngFor="let day of calendarDays"
                 [class.today]="day.isToday"
                 [class.other-month]="!day.isCurrentMonth">
              <span class="day-number">{{ day.day }}</span>
              <div class="day-events" *ngIf="day.events">
                <div class="event-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .welcome-banner h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }

    .welcome-banner p {
      color: var(--text-muted);
    }

    /* Internship Info Card */
    .internship-info-card {
        padding: 1.5rem;
        margin-bottom: 1rem;
        background: white;
    }
    
    .info-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .info-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .info-group.full-width {
        grid-column: 1 / -1;
    }

    .info-group label {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    .info-group p {
        font-size: 1.1rem;
        color: var(--primary);
        font-weight: 600;
        margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    @media (max-width: 968px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .info-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-main);
    }

    .icon {
      font-size: 1.5rem;
    }

    .news-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .news-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .news-card:hover {
      background: white;
      transform: translateX(5px);
      border-color: var(--primary-light);
      box-shadow: var(--shadow-md);
    }

    .news-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg-hover);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      min-width: 70px;
      color: var(--primary);
      border: 1px solid var(--border-color);
    }

    .news-date .date-day { font-size: 1.5rem; font-weight: 700; }
    .news-date .date-month { font-size: 0.875rem; text-transform: uppercase; }

    .news-content h4 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    .news-content p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .badge {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 99px;
      color: white;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 0.5rem;
    }

    .badge-announce {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    }

    .badge-important {
      background: var(--danger);
    }

    .badge-guide {
      background: var(--success);
    }

    .no-news {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }

    /* Calendar Styles */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      text-align: center;
    }

    .weekday {
      font-size: 0.875rem;
      color: var(--text-muted);
      padding-bottom: 0.5rem;
      font-weight: 600;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .calendar-header span {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary);
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      background: white;
      border: 1px solid transparent;
    }

    .calendar-day:hover {
      background: var(--bg-hover);
      border-color: var(--primary-light);
    }

    .calendar-day.today {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 10px var(--primary-glow);
    }

    .calendar-day.other-month {
      opacity: 0.3;
      background: transparent;
    }

    .day-number {
      font-size: 0.875rem;
    }

    .day-events {
      position: absolute;
      bottom: 4px;
    }

    .event-dot {
      width: 4px;
      height: 4px;
      background: var(--secondary);
      border-radius: 50%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  newsItems: Info[] = [];
  currentMonth = new Date();
  weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  calendarDays: CalendarDay[] = [];
  internshipData: InternshipRequest | null = null;

  constructor(
    private infoService: InfoService,
    private datePipe: DatePipe,
    private internshipService: InternshipService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadNews();
    this.generateCalendar();
    this.loadInternshipStatus();
  }

  loadNews(): void {
    this.infoService.getInfos().subscribe({
      next: (data) => {
        this.newsItems = data;
      },
      error: (error) => {
        console.error('Error loading news:', error);
      }
    });
  }

  loadInternshipStatus(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user for internship status:', currentUser);

    if (currentUser && currentUser.username) {
      console.log('Fetching internship for student_code:', currentUser.username);

      this.internshipService.getMyInternship(currentUser.username).subscribe({
        next: (response) => {
          console.log('Internship response:', response);
          if (response.success && response.data) {
            this.internshipData = response.data;
            console.log('Internship data loaded:', this.internshipData);
          } else {
            console.log('No internship data in response');
          }
        },
        error: (error) => {
          // No internship request yet - this is normal for new students
          console.log('Error or no internship request found:', error);
          this.internshipData = null;
        }
      });
    } else {
      console.log('No current user or username');
    }
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        day: prevMonthLastDay - i,
        isToday: false,
        isCurrentMonth: false
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push({
        date,
        day,
        isToday: this.isSameDay(date, today),
        isCurrentMonth: true
      });
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        date: new Date(year, month + 1, day),
        day,
        isToday: false,
        isCurrentMonth: false
      });
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}
