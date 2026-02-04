import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriteriaService, EligibilityCheck, InternshipCriteria } from '../student/services/criteria.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-criteria-check',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">✅</span> ตรวจสอบเกณฑ์การออกฝึกงาน</h2>
        <p>คุณสมบัติที่จำเป็นสำหรับการเริ่มต้นฝึกงานในสถานประกอบการ</p>
      </div>

      <div class="eligibility-banner" [class.eligible]="check.is_eligible" *ngIf="check">
        <div class="banner-content">
          <span class="banner-icon">{{ check.is_eligible ? '🎉' : '⏳' }}</span>
          <div class="banner-text">
            <h3>{{ check.is_eligible ? 'คุณมีสิทธิ์ออกฝึกงานได้' : 'คุณยังไม่ผ่านเกณฑ์การฝึกงาน' }}</h3>
            <p>{{ check.is_eligible ? 'สามารถดำเนินการขั้นต่อไปได้ทันที' : 'กรุณาตรวจสอบข้อกำหนดที่ยังไม่ครบถ้วนด้านล่าง' }}</p>
          </div>
        </div>
      </div>

      <div class="glass-panel content-card">
        <div class="section-title">
          <h3>📋 รายละเอียดเกณฑ์การตรวจสอบ</h3>
        </div>

        <ul class="criteria-list">
          <!-- GPA Criterion -->
          <li class="criteria-item" [class.completed]="check?.details?.gpa_pass">
            <span class="status-icon">{{ check?.details?.gpa_pass ? '✔️' : '✕' }}</span>
            <div class="criteria-content">
              <h4>ผลการเรียนเฉลี่ยสะสม (GPA)</h4>
              <p>เกณฑ์: ต้องไม่ต่ำกว่า 2.00</p>
              <div class="current-value" *ngIf="check?.data">
                ปัจจุบัน: <span [class.pass]="check?.details?.gpa_pass">{{ check?.data?.gpa }}</span>
              </div>
            </div>
          </li>

          <!-- Credits Criterion -->
          <li class="criteria-item" [class.completed]="check?.details?.credits_pass">
            <span class="status-icon">{{ check?.details?.credits_pass ? '✔️' : '✕' }}</span>
            <div class="criteria-content">
              <h4>หน่วยกิตสะสม</h4>
              <p>เกณฑ์: ต้องผ่านรายวิชาทฤษฎีไม่น้อยกว่า 90 หน่วยกิต</p>
              <div class="current-value" *ngIf="check?.data">
                ปัจจุบัน: <span [class.pass]="check?.details?.credits_pass">{{ check?.data?.credits_completed }} หน่วยกิต</span>
              </div>
            </div>
          </li>

          <!-- Required Courses Criterion -->
          <li class="criteria-item" [class.completed]="check?.details?.courses_pass">
            <span class="status-icon">{{ check?.details?.courses_pass ? '✔️' : '✕' }}</span>
            <div class="criteria-content">
              <h4>วิชาบังคับก่อนฝึกงาน</h4>
              <p>เกณฑ์: ผ่านรายวิชาเตรียมฝึกประสบการณ์วิชาชีพไอที</p>
              <div class="current-value">
                สถานะ: <span [class.pass]="check?.details?.courses_pass">{{ check?.details?.courses_pass ? 'ผ่านแล้ว' : 'ยังไม่ผ่าน' }}</span>
              </div>
            </div>
          </li>

          <!-- Advisor Approval Criterion -->
          <li class="criteria-item" [class.completed]="check?.details?.advisor_pass">
            <span class="status-icon">{{ check?.details?.advisor_pass ? '✔️' : '✕' }}</span>
            <div class="criteria-content">
              <h4>การอนุมัติจากอาจารย์ที่ปรึกษา</h4>
              <p>เกณฑ์: ได้รับความเห็นชอบให้ออกฝึกงาน</p>
              <div class="current-value">
                สถานะ: <span [class.pass]="check?.details?.advisor_pass">{{ check?.details?.advisor_pass ? 'อนุมัติแล้ว' : 'รอการอนุมัติ' }}</span>
              </div>
            </div>
          </li>
        </ul>

        <div class="notes-section" *ngIf="check?.data?.notes">
          <h5>บันทึกเพิ่มเติม:</h5>
          <p>{{ check?.data?.notes }}</p>
        </div>
      </div>

      <div class="action-footer">
        <button class="btn btn-primary" (click)="loadEligibility()">
          <span class="icon">🔄</span> อัปเดตข้อมูล
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; padding: 1rem; }
    .page-header { margin-bottom: 2rem; }
    
    .eligibility-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      border-radius: 20px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .eligibility-banner.eligible {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
    }

    .banner-content { display: flex; align-items: center; gap: 1.5rem; }
    .banner-icon { font-size: 2.5rem; }
    .banner-text h3 { margin: 0; color: var(--text-main); }
    .banner-text p { margin: 0.25rem 0 0 0; color: var(--text-muted); }

    .content-card { padding: 2rem; }
    .section-title { border-bottom: 2px solid var(--primary); margin-bottom: 1.5rem; padding-bottom: 0.5rem; }
    
    .criteria-list { list-style: none; padding: 0; margin: 0; }
    
    .criteria-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: var(--bg-hover);
      margin-bottom: 1rem;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .criteria-item.completed {
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.05);
    }

    .status-icon { 
      font-size: 1.25rem; 
      width: 32px; height: 32px; 
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
    }

    .completed .status-icon {
      background: #10b981;
      color: white;
    }
    
    .criteria-content h4 { margin: 0 0 0.25rem 0; font-weight: 600; }
    .criteria-content p { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-muted); }

    .current-value { font-size: 0.875rem; font-weight: 600; }
    .pass { color: #10b981; }

    .notes-section {
      margin-top: 2rem;
      padding: 1.25rem;
      background: rgba(59, 130, 246, 0.05);
      border-radius: 12px;
      border-left: 4px solid var(--primary);
    }

    .notes-section h5 { margin-top: 0; margin-bottom: 0.5rem; }
    .notes-section p { margin: 0; font-size: 0.9rem; color: var(--text-muted); }

    .action-footer { margin-top: 2rem; display: flex; justify-content: center; }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem;
      border: none;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }
  `]
})
export class CriteriaCheckComponent implements OnInit {
  check: EligibilityCheck | null = null;

  constructor(
    private criteriaService: CriteriaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadEligibility();
  }

  loadEligibility(): void {
    this.criteriaService.checkEligibility().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.check = res;
        }
      },
      error: (err: any) => {
        console.error('Error checking eligibility:', err);
      }
    });
  }
}
