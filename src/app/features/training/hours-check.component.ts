import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyLogService, HoursSummary, DailyLog } from '../student/services/daily-log.service';
import { AuthService } from '../../auth/auth.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-hours-check',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmPopupModule, PaginatorModule],
  providers: [ConfirmationService],
  template: `
    <div class="page-container animate-fade-in">
      <p-confirmpopup></p-confirmpopup>
      <div class="page-header">
        <h2><span class="icon">⏱️</span> บันทึกเวลาและการประเมินการฝึกงาน</h2>
        <p>ติดตามชั่วโมงการทำงานและบันทึกความคืบหน้ารายวัน</p>
      </div>

      <div class="dashboard-layout">
        <!-- Left Panel: Log Recording -->
        <div class="left-panel">
          <div class="glass-panel section-card">
            <div class="section-title">
              <h3>📋 รายละเอียดการฝึกงาน</h3>
            </div>

            <div class="stats-summary-grid">
              <div class="stat-item">
                <label>จำนวนชั่วโมงฝึก *</label>
                <div class="value-box">{{ summary?.total_hours || 0 }} ชั่วโมง</div>
              </div>
              <div class="stat-item">
                <label>จำนวนวันที่ขาดงาน *</label>
                <div class="value-box">0 วัน</div>
                <small>1 วัน = 8 ชั่วโมง</small>
              </div>
              <div class="stat-item">
                <label>จำนวนวันที่ลากิจ/ลาป่วย *</label>
                <div class="value-box">0 วัน</div>
                <small>1 วัน = 8 ชั่วโมง</small>
              </div>
            </div>

            <div class="daily-log-section">
              <div class="log-header">
                <h4>📝 บันทึกชั่วโมงการฝึกแต่ละวัน</h4>
                <button class="btn-add" (click)="showLogForm = !showLogForm">
                  <span class="icon">{{ showLogForm ? '✕' : '+' }}</span>
                  {{ showLogForm ? 'ยกเลิก' : 'เพิ่มรายการ' }}
                </button>
              </div>

              <!-- New Log Form -->
              <div *ngIf="showLogForm" class="log-form-card animate-slide-down">
                <form [formGroup]="logForm" (ngSubmit)="onSubmitLog()">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>วันที่ *</label>
                      <input type="date" formControlName="log_date" class="form-control">
                    </div>
                    <div class="form-group">
                      <label>จำนวนชั่วโมง *</label>
                      <input type="number" formControlName="hours_worked" class="form-control" step="0.5" min="0.5" max="24">
                    </div>
                    <div class="form-group full-width">
                      <label>รายละเอียดงานที่ปฏิบัติ *</label>
                      <textarea formControlName="work_description" class="form-control" rows="6" 
                                placeholder="เช่น พัฒนาหน้าจอ Dashboard ด้วย Angular และแก้ไข API สำหรับการดึงข้อมูล..."></textarea>
                    </div>
                    <div class="form-group full-width">
                      <label>รูปภาพประกอบ (หลักฐานการทำงาน) *</label>
                      <div class="upload-box" [class.has-file]="selectedPhoto" (click)="fileInput.click()">
                        <input type="file" #fileInput (change)="onPhotoSelected($event)" accept="image/*" hidden>
                        <div *ngIf="!photoPreview" class="upload-placeholder">
                          <span class="upload-icon">📸</span>
                          <p>คลิกเพื่ออัปโหลดรูปภาพ</p>
                        </div>
                        <img *ngIf="photoPreview" [src]="photoPreview" class="preview-img">
                      </div>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-submit" [disabled]="isLoading">
                      {{ isLoading ? 'กำลังบันทึก...' : 'บันทึกรายการ' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Empty State or List of Logs -->
              <div *ngIf="!showLogForm && (logs.length === 0)" class="empty-logs">
                <div class="empty-inner">
                  <span class="empty-icon">📅</span>
                  <h5>ยังไม่มีรายการบันทึกชั่วโมง</h5>
                  <p>คลิก "เพิ่มรายการ" เพื่อเริ่มบันทึก</p>
                </div>
              </div>

              <!-- Log History List -->
              <div *ngIf="!showLogForm && logs.length > 0" class="logs-list">
                <div *ngFor="let log of logs.slice(first, first + rows)" class="log-item glass-panel">
                  <div class="log-info">
                    <div class="log-date-badge" [class.weekend]="log.is_weekend">
                      <span class="day">{{ log.log_date | date:'dd' }}</span>
                      <span class="month">{{ log.log_date | date:'MMM' }}</span>
                    </div>
                    <div class="log-details">
                      <div class="log-top">
                        <span class="hours">{{ log.hours_worked }} ชม.</span>
                        <span class="type-tag" [class.weekend]="log.is_weekend">
                          {{ log.is_weekend ? 'วันหยุด' : 'วันปกติ' }}
                        </span>
                      </div>
                      <p class="desc">{{ log.work_description }}</p>
                    </div>
                  </div>
                  <div class="log-photo" *ngIf="log.photo_url">
                    <img [src]="log.photo_url" alt="Log evidence" (click)="openImage(log.photo_url)">
                  </div>
                  <div class="log-actions">
                    <button class="btn-icon delete" (click)="deleteLog(log.id!, $event)" title="ลบรายการ">✕</button>
                  </div>
                </div>
                
                <p-paginator 
                  [first]="first" 
                  [rows]="rows" 
                  [totalRecords]="logs.length" 
                  (onPageChange)="onPageChange($event)"
                  [rowsPerPageOptions]="[5, 10, 20]"
                  styleClass="custom-paginator">
                </p-paginator>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Calculation Results -->
        <div class="right-panel">
          <div class="glass-panel calculation-card">
            <div class="section-title">
              <h3>📈 ผลการคำนวณ</h3>
            </div>

            <div class="calculation-list">
              <div class="calc-item">
                <span>ชั่วโมงฝึกทั้งหมด:</span>
                <span class="val">{{ summary?.total_hours || 0 }} ชม.</span>
              </div>
              <div class="calc-item deduction">
                <span>หัก: วันขาดงาน (0 วัน):</span>
                <span class="val">-0 ชม.</span>
              </div>
              <div class="calc-item deduction">
                <span>หัก: วันลา (0 วัน):</span>
                <span class="val">-0 ชม.</span>
              </div>
              <div class="divider"></div>
              <div class="calc-item summary">
                <span>ชั่วโมงสุทธิ:</span>
                <span class="val highlight">{{ summary?.total_hours || 0 }} ชม.</span>
              </div>
              <div class="calc-item target">
                <span>ชั่วโมงที่ต้องการ ({{ summary?.required_total_hours || 400 }} ชม.):</span>
                <span class="val">{{ summary?.required_total_hours || 400 }} ชม.</span>
              </div>
            </div>

            <div class="progress-section">
              <div class="progress-header">
                <span>ความคืบหน้า</span>
                <span class="percent">{{ summary?.total_percentage || 0 }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="summary?.total_percentage || 0"></div>
              </div>
            </div>

            <button class="btn-evaluation" [disabled]="(summary?.total_percentage || 0) < 100">
               <span class="icon">🕒</span> รอการประเมิน
            </button>

            <div class="alert-info">
              <span class="icon">ℹ️</span>
              <p>กรุณากรอกข้อมูลเพื่อดูผลการประเมิน</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div *ngIf="previewImage" class="image-modal" (click)="previewImage = null">
      <img [src]="previewImage" alt="Full Preview">
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .dashboard-layout {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
      align-items: start;
    }

    @media (max-width: 1100px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
    }

    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 1.5rem;
    }

    .section-title {
      border-bottom: 2px solid var(--primary);
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
    }

    .section-title h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary);
    }

    /* Stats Summary Grid */
    .stats-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-item label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .value-box {
      background: var(--bg-hover);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      font-weight: 600;
      font-size: 1.125rem;
    }

    .stat-item small {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    /* Daily Log Section */
    .daily-log-section {
      background: rgba(59, 130, 246, 0.05);
      border: 2px dashed var(--primary-glow);
      border-radius: 20px;
      padding: 1.5rem;
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .log-header h4 {
      color: var(--primary);
      font-weight: 600;
    }

    .btn-add {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    /* Log Form */
    .log-form-card {
      background: var(--bg-main);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--primary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }

    .form-control {
      width: 100%;
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.75rem;
      color: var(--text-main);
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .upload-box {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-box:hover {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.05);
    }

    .upload-box.has-file {
      border-style: solid;
      padding: 0.5rem;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .upload-icon { font-size: 2.5rem; }

    .preview-img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }

    .btn-submit {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      border: none;
      padding: 0.75rem 2.5rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    /* Logs List */
    .logs-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .log-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      border-left: 5px solid var(--primary);
    }

    .log-info {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .log-date-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg-hover);
      padding: 0.5rem;
      border-radius: 10px;
      min-width: 60px;
      border: 1px solid var(--border-color);
    }

    .log-date-badge.weekend {
      background: rgba(239, 68, 68, 0.1);
      border-color: var(--danger);
      color: var(--danger);
    }

    .log-date-badge .day { font-size: 1.25rem; font-weight: 700; }
    .log-date-badge .month { font-size: 0.75rem; text-transform: uppercase; }

    .log-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .log-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .hours { font-weight: 700; color: var(--secondary); }

    .type-tag {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 8px;
      background: var(--bg-hover);
      color: var(--text-muted);
    }

    .type-tag.weekend { background: var(--danger); color: white; }

    .desc {
      font-size: 0.9rem;
      color: var(--text-main);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .log-photo img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      cursor: zoom-in;
    }

    .btn-icon.delete {
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 1.25rem;
      cursor: pointer;
    }

    .btn-icon.delete:hover { color: var(--danger); }

    .empty-logs {
      text-align: center;
      padding: 3rem;
      color: var(--text-dim);
    }

    .empty-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
    
    /* Right Panel Calculation */
    .calculation-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .calc-item {
      display: flex;
      justify-content: space-between;
      color: var(--text-main);
    }

    .calc-item.deduction { color: var(--danger); }
    .calc-item.summary { font-size: 1.25rem; font-weight: 700; }
    .calc-item .highlight { color: var(--secondary); }

    .divider { height: 1px; background: var(--border-color); margin: 0.5rem 0; }

    .progress-section { margin-bottom: 2rem; }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .progress-track {
      height: 12px;
      background: var(--bg-hover);
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      transition: width 1s ease-out;
    }

    .btn-evaluation {
      width: 100%;
      background: orange;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 16px;
      font-size: 1.125rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      cursor: pointer;
    }

    .btn-evaluation:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert-info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid var(--primary);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .alert-info p { font-size: 0.875rem; color: var(--text-main); margin: 0; }

    .image-modal {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    }

    .image-modal img { max-width: 90%; max-height: 90%; }

    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    ::ng-deep .custom-paginator {
      background: transparent !important;
      border: none !important;
    }
  `]
})
export class HoursCheckComponent implements OnInit {
  logs: DailyLog[] = [];
  summary: HoursSummary | null = null;
  isLoading = false;
  showLogForm = false;
  logForm: FormGroup;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  previewImage: string | null = null;

  // Pagination
  first = 0;
  rows = 5;

  constructor(
    private fb: FormBuilder,
    private dailyLogService: DailyLogService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.logForm = this.fb.group({
      log_date: [new Date().toISOString().split('T')[0], Validators.required],
      hours_worked: [8, [Validators.required, Validators.min(0.5), Validators.max(24)]],
      work_description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dailyLogService.getLogs().subscribe({
      next: (res: any) => { if (res.success) this.logs = res.data; },
      error: (err) => console.error('Error loading logs:', err)
    });
    this.dailyLogService.getSummary().subscribe({
      next: (res: any) => { if (res.success) this.summary = res.data; },
      error: (err) => console.error('Error loading summary:', err)
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.photoPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmitLog(): void {
    if (this.logForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน (รายละเอียดต้องมากกว่า 10 ตัวอักษร)');
      return;
    }
    if (!this.selectedPhoto) {
      alert('กรุณาอัปโหลดรูปภาพหลักฐาน');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('log_date', this.logForm.value.log_date);
    formData.append('hours_worked', this.logForm.value.hours_worked.toString());
    formData.append('work_description', this.logForm.value.work_description);
    formData.append('photo', this.selectedPhoto);

    this.dailyLogService.createLog(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('บันทึกสำเร็จ!');
          this.showLogForm = false;
          this.logForm.reset({
            log_date: new Date().toISOString().split('T')[0],
            hours_worked: 8,
            work_description: ''
          });
          this.selectedPhoto = null;
          this.photoPreview = null;
          this.loadData();
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error saving log:', err);
        alert(err.error?.message || 'เกิดข้อผิดพลาดในการบันทึก');
        this.isLoading = false;
      }
    });
  }

  deleteLog(id: number, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'ยืนยันว่าต้องการลบรายการนี้?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ลบ',
      rejectLabel: 'ยกเลิก',
      accept: () => {
        this.dailyLogService.deleteLog(id).subscribe({
          next: () => {
            this.loadData();
            // alert('ลบรายการสำเร็จ'); // Optional: Remove excessive alerts
          },
          error: (err) => alert('เกิดข้อผิดพลาดในการลบรายการ')
        });
      }
    });
  }

  openImage(url: string): void {
    this.previewImage = url;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}
