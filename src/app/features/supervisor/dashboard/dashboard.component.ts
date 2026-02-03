import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorService } from '../services/supervisor.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-supervisor-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard ผู้นิเทศงาน</h1>
        <div class="user-info">
          <span>ยินดีต้อนรับ, {{ supervisorName }}</span>
        </div>
      </header>
      
      <div class="content-wrapper">
        <div class="section-title">
          <h2>รายชื่อนักศึกษาฝึกงานในความดูแล</h2>
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
                <span class="label">มหาวิทยาลัย:</span>
                <span class="value">ราชภัฏเชียงใหม่</span>
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

    .dashboard-header h1 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }

    .section-title h2 {
      font-size: 1.4rem;
      color: #555;
      margin-bottom: 1.5rem;
      border-left: 5px solid #e24a4a;
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
      background: linear-gradient(135deg, #e24a4a 0%, #bd3535 100%);
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
export class SupervisorDashboardComponent implements OnInit {
    students: any[] = [];
    supervisorName: string = '';

    constructor(
        private supervisorService: SupervisorService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const user = this.authService.getCurrentUser();
        this.supervisorName = user?.name || 'ผู้นิเทศงาน';
        this.loadStudents();
    }

    loadStudents() {
        this.supervisorService.getMyStudents().subscribe({
            next: (data) => {
                this.students = data;
            },
            error: (err) => {
                console.error('Error loading students:', err);
            }
        });
    }

    openAssessment(student: any) {
        this.router.navigate(['/supervisor/assessment', student.student_id]);
    }
}
