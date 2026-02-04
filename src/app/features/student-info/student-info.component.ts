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
        <h2><span class="icon">🎓</span> ข้อมูลนักศึกษา</h2>
        <p>จัดการข้อมูลส่วนตัวและข้อมูลทางวิชาการของคุณ</p>
      </div>

      <div class="glass-panel form-card">
        <div class="form-header">
          <h3>ข้อมูลส่วนตัว</h3>
          <div class="actions">
            <button *ngIf="!isEditing" class="btn btn-outline" (click)="toggleEdit()">
              <span class="icon">✏️</span> แก้ไขข้อมูล
            </button>
            <div *ngIf="isEditing" class="edit-actions">
              <button class="btn btn-ghost" (click)="cancelEdit()">ยกเลิก</button>
              <button class="btn btn-primary" (click)="saveProfile()" [disabled]="isLoading">
                {{ isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-grid" *ngIf="student">
          <!-- Fixed Fields -->
          <div class="form-group">
            <label class="form-label">รหัสนักศึกษา</label>
            <div class="view-value">{{ student.student_code }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">ชื่อ (ภาษาไทย)</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.name_th || '-' }}</div>
            <input *ngIf="isEditing" type="text" [(ngModel)]="editData.name_th" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">ชื่อ (ภาษาอังกฤษ)</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.name_en || '-' }}</div>
            <input *ngIf="isEditing" type="text" [(ngModel)]="editData.name_en" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">เกรดเฉลี่ย (GPA)</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.gpa || '-' }}</div>
            <input *ngIf="isEditing" type="number" [(ngModel)]="editData.gpa" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">หน่วยกิตสะสม</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.cumulative_credits || '0' }}</div>
            <input *ngIf="isEditing" type="number" [(ngModel)]="editData.cumulative_credits" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">คณะ</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.faculty || '-' }}</div>
            <input *ngIf="isEditing" type="text" [(ngModel)]="editData.faculty" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">สาขาวิชา</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.major || '-' }}</div>
            <input *ngIf="isEditing" type="text" [(ngModel)]="editData.major" class="form-control">
          </div>

          <div class="divider full-width"></div>

          <div class="form-group">
            <label class="form-label">อีเมล</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.email || '-' }}</div>
            <input *ngIf="isEditing" type="email" [(ngModel)]="editData.email" class="form-control">
          </div>

          <div class="form-group">
            <label class="form-label">เบอร์โทรศัพท์</label>
            <div *ngIf="!isEditing" class="view-value">{{ student.phone || '-' }}</div>
            <input *ngIf="isEditing" type="text" [(ngModel)]="editData.phone" class="form-control">
          </div>

          <div class="form-group full-width">
            <label class="form-label">ที่อยู่</label>
            <div *ngIf="!isEditing" class="view-value pre-wrap">{{ student.address || '-' }}</div>
            <textarea *ngIf="isEditing" [(ngModel)]="editData.address" class="form-control" rows="3"></textarea>
          </div>
        </div>
        
        <div *ngIf="!student" class="loading-state">
          Loading student data...
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-info-container { max-width: 900px; margin: 0 auto; padding-bottom: 2rem; }
    .header-section { margin-bottom: 2rem; }
    .header-section h2 { font-size: 2rem; color: var(--text-main); margin-bottom: 0.5rem; }
    .header-section p { color: var(--text-muted); }

    .form-card { padding: 2.5rem; border-radius: 20px; background: white; border: 1px solid var(--border-color); }
    .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
    .form-header h3 { font-size: 1.5rem; color: var(--text-main); margin: 0; }

    .actions { display: flex; gap: 1rem; }
    .edit-actions { display: flex; gap: 0.5rem; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .full-width { grid-column: 1 / -1; }
    .divider { height: 1px; background: var(--border-color); margin: 1rem 0; }

    .form-label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text-muted); margin-bottom: 0.5rem; }
    .view-value { font-size: 1.1rem; color: var(--text-main); font-weight: 500; padding: 0.5rem 0; }
    .pre-wrap { white-space: pre-wrap; }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }

    .btn { padding: 0.6rem 1.25rem; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; border: none; transition: 0.2s; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }
    .btn-outline:hover { background: var(--bg-hover); }
    .btn-ghost { background: transparent; color: var(--text-muted); }
    .btn-ghost:hover { background: var(--bg-hover); color: var(--text-main); }
    
    .loading-state { text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class StudentInfoComponent implements OnInit {
  student: Student | null = null;
  editData: any = {};
  isLoading = false;
  isEditing = false;

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
          this.resetEditData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = true;
    this.resetEditData();
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetEditData();
  }

  resetEditData() {
    if (this.student) {
      this.editData = { ...this.student };
    }
  }

  saveProfile() {
    if (!this.editData) return;

    // Basic validation
    if (!this.editData.name_th || !this.editData.name_en) {
      alert('กรุณากรอกชื่อภาษาไทยและภาษาอังกฤษ');
      return;
    }

    if (this.editData.email && !this.isValidEmail(this.editData.email)) {
      alert('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (this.editData.gpa && (this.editData.gpa < 0 || this.editData.gpa > 4)) {
      alert('เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00');
      return;
    }

    if (this.editData.cumulative_credits && this.editData.cumulative_credits < 0) {
      alert('หน่วยกิตสะสมต้องไม่ต่ำกว่า 0');
      return;
    }

    this.isLoading = true;
    this.studentService.updateProfile(this.editData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isEditing = false;
          alert('✅ บันทึกข้อมูลสำเร็จ!');
          this.loadProfile();
        } else {
          alert('เกิดข้อผิดพลาด: ' + (response.message || 'ไม่สามารถบันทึกข้อมูลได้'));
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        if (error.error?.message) errorMessage = error.error.message;
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
