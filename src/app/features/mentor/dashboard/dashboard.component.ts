import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MentorService } from '../services/mentor.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, DatePickerModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard อาจารย์นิเทศ</h1>
        <div class="user-info">
          <span>ยินดีต้อนรับ, {{ mentorName }}</span>
        </div>
      </header>
      
      <div class="content-wrapper">
        <div class="dashboard-grid">
         <div class="main-content">
          <div class="section-title">
            <h2>รายชื่อนักศึกษาในความดูแล</h2>
          </div>

        <div class="student-grid">
          <div *ngFor="let student of students" class="student-card">
            <div class="card-header">
              <div class="avatar-placeholder">
                {{ student.name.charAt(0) }}
              </div>
              <div class="student-info">
                <h3>{{ student.name }} {{ student.surname }}</h3>
                <p class="student-code">{{ student.student_code }}</p>
              </div>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="label">สาขา:</span>
                <span class="value">{{ student.major }}</span>
              </div>
              <div class="info-row">
                <span class="label">ฝึกงานที่:</span>
                <span class="value">{{ student.company_name || 'ยังไม่มีข้อมูล' }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button (click)="openAssessment(student)" class="btn-assess">
                <i class="pi pi-file-edit"></i> ประเมินผล
              </button>
            </div>
          </div>
          
          <div *ngIf="students.length === 0" class="no-data">
            <p>ไม่พบรายชื่อนักศึกษาในความดูแล</p>
          </div>
          </div>
         </div>

         <!-- Sidebar with Calendar -->
         <div class="sidebar">
            <div class="mini-calendar-card">
              <div class="calendar-header-mini">
                 <i class="pi pi-calendar"></i>
                 <span>ปฏิทินงาน</span>
              </div>
               <p-datepicker [inline]="true" [ngModel]="currentDate" styleClass="mini-calendar"></p-datepicker>
            </div>

            <div class="stats-card-mini">
               <div class="stat-icon-mini">👨‍🎓</div>
               <div class="stat-info-mini">
                  <span class="stat-label">นักศึกษาทั้งหมด</span>
                  <span class="stat-value">{{ students.length }} คน</span>
               </div>
            </div>
         </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 2rem;
        align-items: start;
    }

    @media (max-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        .sidebar { order: -1; } /* On mobile, stats/calendar on top or bottom as preferred */
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .mini-calendar-card {
        background: white;
        padding: 1rem; /* Compact padding */
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    
    .calendar-header-mini {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
        color: #555;
        font-weight: 600;
        font-size: 0.95rem;
    }
    .calendar-header-mini i { color: #4a90e2; }

    /* Stats Mini Card */
    .stats-card-mini {
        background: white;
        padding: 1.25rem;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .stat-icon-mini {
        width: 45px;
        height: 45px;
        background: #e3f2fd;
        color: #4a90e2;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    .stat-info-mini { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.85rem; color: #888; }
    .stat-value { font-size: 1.1rem; font-weight: 600; color: #333; }

    /* Overrides for mini calendar */
    :host ::ng-deep .mini-calendar {
        border: none !important;
        width: 100%;
    }
    :host ::ng-deep .mini-calendar .p-datepicker {
        padding: 0;
        width: 100%;
    }
    :host ::ng-deep .mini-calendar .p-datepicker table td > span {
        width: 30px;
        height: 30px;
        font-size: 0.85rem;
    }
    :host ::ng-deep .mini-calendar .p-datepicker-header {
        padding: 0.5rem;
    }

    .dashboard-header h1 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }

    .section-title h2 {
      font-size: 1.4rem;
      color: #555;
      margin-bottom: 1.5rem;
      border-left: 5px solid #4a90e2;
      padding-left: 10px;
    }

    .student-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .student-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
    }

    .student-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }

    .card-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
      color: white;
    }

    .avatar-placeholder {
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-right: 1rem;
    }

    .student-info h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .student-code {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .card-body {
      padding: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }

    .label {
      color: #888;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .card-actions {
      padding: 1rem 1.5rem;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
    }

    .btn-assess {
      width: 100%;
      padding: 0.8rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .btn-assess:hover {
      background-color: #45a049;
    }

    .no-data {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #999;
      background: white;
      border-radius: 12px;
    }
  `]
})
export class MentorDashboardComponent implements OnInit {
  students: any[] = [];
  mentorName: string = '';
  currentDate = new Date();

  constructor(
    private mentorService: MentorService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.mentorName = user?.name || 'อาจารย์';
    this.loadStudents();
  }

  loadStudents() {
    this.mentorService.getMyStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        console.error('Error loading students:', err);
      }
    });
  }

  openAssessment(student: any) {
    this.router.navigate(['/mentor/assessment', student.student_id]);
  }
}
