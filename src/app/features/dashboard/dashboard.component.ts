import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InfoService, Info } from '../officer/services/info.service';
import { ProcessTrackerComponent } from './components/process-tracker.component';
import { InternshipService } from '../internship/services/internship';
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
      <app-process-tracker [internshipStatus]="internshipStatus"></app-process-tracker>

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

    .welcome-banner {
    }

    .welcome-banner h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .welcome-banner p {
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
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--glass-border);
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
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
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .news-card:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: translateX(5px);
    }

    .news-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(66, 133, 244, 0.1);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      min-width: 70px;
      color: #4285d4ff;
    }

    .news-date .date-day { font-size: 1.5rem; font-weight: 700; }
    .news-date .date-month { font-size: 0.875rem; text-transform: uppercase; }

    .news-content {
    }

    .news-content h4 {
      margin: 0;
      font-size: 1.125rem;
    }

    .news-content p {
      margin: 0;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.7);
      font-size: 0.9rem;
    }

    .badge {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      display: inline-block;
    }

    .badge-announce {
      background: linear-gradient(135deg, #4285f4 0%, #1967d2 100%);
    }

    .badge-important {
      background: #ea4335;
    }

    .badge-guide {
      background: linear-gradient(135deg, #34a853 0%, #0d652d 100%);
    }

    .no-news {
      text-align: center;
      padding: 2rem;
      color: rgba(0, 0, 0, 0.5);
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
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .calendar-day:hover {
      background: rgba(66, 133, 244, 0.1);
    }

    .calendar-day.today {
      background: #4285f4;
      color: white;
    }

    .calendar-day.other-month {
      opacity: 0.3;
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
      background: #ea4335;
      border-radius: 50%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  newsItems: Info[] = [];
  currentMonth = new Date();
  weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  calendarDays: CalendarDay[] = [];
  internshipStatus: string | null = null;

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
            this.internshipStatus = response.data.status;
            console.log('Internship status set to:', this.internshipStatus);
          } else {
            console.log('No internship data in response');
          }
        },
        error: (error) => {
          // No internship request yet - this is normal for new students
          console.log('Error or no internship request found:', error);
          this.internshipStatus = null;
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
