import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from './student.service';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="student-info-container animate-fade-in">
      <div class="header-section">
        <h2><span class="icon">🎓</span> Student Information</h2>
        <p>Manage your personal and academic details.</p>
      </div>

      <div class="glass-panel form-card">
        <div class="form-header">
          <h3>Personal Details</h3>
          <button class="btn btn-primary" (click)="saveProfile()" [disabled]="isLoading">
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <div class="form-grid" *ngIf="student">
          <!-- Read-Only / Fixed Fields -->
          <div class="form-group">
            <label class="form-label">Student Code</label>
            <input type="text" [value]="student.student_code" class="form-control" disabled>
          </div>

          <div class="form-group">
            <label class="form-label">Name (Thai)</label>
            <input type="text" [(ngModel)]="student.name_th" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">Name (English)</label>
            <input type="text" [(ngModel)]="student.name_en" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">GPA</label>
            <input type="number" [(ngModel)]="student.gpa" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">Faculty</label>
            <input type="text" [(ngModel)]="student.faculty" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">Major</label>
            <input type="text" [(ngModel)]="student.major" class="form-control">
          </div>

          <div class="divider full-width"></div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" [(ngModel)]="student.email" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" [(ngModel)]="student.phone" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">Address</label>
            <textarea [(ngModel)]="student.address" class="form-control" rows="3"></textarea>
          </div>
        </div>
        
        <div *ngIf="!student" class="loading-state">
          Loading student data...
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-info-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 2rem;
    }

    .form-card {
      padding: 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .divider {
      height: 1px;
      background: var(--glass-border);
      margin: 1rem 0;
    }

    /* Override input styles for specific context if needed */
    .form-control:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: rgba(0,0,0,0.4);
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class StudentInfoComponent implements OnInit {
  student: Student | null = null;
  isLoading = false;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.studentService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.student = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        alert('ไม่สามารถโหลดข้อมูลนักศึกษาได้ กรุณาลองใหม่อีกครั้ง');
        this.isLoading = false;
      }
    });
  }

  saveProfile() {
    if (!this.student) return;

    // Basic validation
    if (!this.student.name_th || !this.student.name_en) {
      alert('กรุณากรอกชื่อภาษาไทยและภาษาอังกฤษ');
      return;
    }

    if (this.student.email && !this.isValidEmail(this.student.email)) {
      alert('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (this.student.gpa && (this.student.gpa < 0 || this.student.gpa > 4)) {
      alert('เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00');
      return;
    }

    this.isLoading = true;
    this.studentService.updateProfile(this.student).subscribe({
      next: (response) => {
        if (response.success) {
          alert('✅ บันทึกข้อมูลสำเร็จ!');
          this.loadProfile(); // Reload to get fresh data
        } else {
          alert('เกิดข้อผิดพลาด: ' + (response.message || 'ไม่สามารถบันทึกข้อมูลได้'));
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join('\n');
        }

        alert(errorMessage);
        this.isLoading = false;
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
