import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingEvidenceService, TrainingEvidenceData } from './services/training-evidence.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';

interface HoursEntry {
  date: string;
  hours: number;
  description: string;
}

@Component({
  selector: 'app-training-evidence',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="page-container">
      <div class="page-header">
        <h2><span class="icon">📋</span> ส่งหลักฐานการฝึกงาน</h2>
        <p>กรอกข้อมูลชั่วโมงการฝึกงานและวันลา/ขาดงาน</p>
      </div>

      <div class="content-grid">
        <!-- Form Card -->
        <div class="glass-panel form-card">
          <h3>รายละเอียดการฝึกงาน</h3>
          
          <form (ngSubmit)="onSubmit()" #evidenceForm="ngForm">
            <div class="form-group">
              <label for="totalHours">จำนวนชั่วโมงฝึก <span class="required">*</span></label>
              <p-inputNumber
                id="totalHours"
                [(ngModel)]="formData.total_training_hours"
                name="totalHours"
                [min]="0"
                [max]="1000"
                [showButtons]="true"
                [step]="1"
                suffix=" ชั่วโมง"
                placeholder="กรอกจำนวนชั่วโมง"
                (ngModelChange)="calculateHours()"
                required
                styleClass="w-full"
              />
            </div>

            <div class="form-group">
              <label for="absenceDays">จำนวนวันที่ขาดงาน <span class="required">*</span></label>
              <p-inputNumber
                id="absenceDays"
                [(ngModel)]="formData.absence_days"
                name="absenceDays"
                [min]="0"
                [max]="365"
                [showButtons]="true"
                [step]="1"
                suffix=" วัน"
                placeholder="กรอกจำนวนวัน"
                (ngModelChange)="calculateHours()"
                required
                styleClass="w-full"
              />
              <small class="helper-text">1 วัน = 8 ชั่วโมง</small>
            </div>

            <div class="form-group">
              <label for="leaveDays">จำนวนวันที่ลากิจ/ลาป่วย <span class="required">*</span></label>
              <p-inputNumber
                id="leaveDays"
                [(ngModel)]="formData.leave_days"
                name="leaveDays"
                [min]="0"
                [max]="365"
                [showButtons]="true"
                [step]="1"
                suffix=" วัน"
                placeholder="กรอกจำนวนวัน"
                (ngModelChange)="calculateHours()"
                required
                styleClass="w-full"
              />
              <small class="helper-text">1 วัน = 8 ชั่วโมง</small>
            </div>

            <!-- Daily Hours Log Section -->
            <div class="hours-log-section">
              <div class="section-header">
                <h4>📝 บันทึกชั่วโมงการฝึกแต่ละวัน</h4>
                <button
                  pButton
                  type="button"
                  label="เพิ่มรายการ"
                  icon="pi pi-plus"
                  class="p-button-sm p-button-success"
                  (click)="addHoursEntry()"
                ></button>
              </div>

              <div class="hours-entries" *ngIf="hoursEntries.length > 0">
                <table class="hours-table">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>ชั่วโมง</th>
                      <th>รายละเอียดงาน</th>
                      <th style="width: 80px;">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let entry of hoursEntries; let i = index" class="entry-row">
                      <td>
                        <input
                          type="date"
                          [(ngModel)]="entry.date"
                          [name]="'entryDate' + i"
                          class="table-input date-input-sm"
                          (ngModelChange)="calculateTotalFromEntries()"
                        />
                      </td>
                      <td>
                        <p-inputNumber
                          [(ngModel)]="entry.hours"
                          [name]="'entryHours' + i"
                          [min]="0"
                          [max]="24"
                          [step]="0.5"
                          suffix=" ชม."
                          [showButtons]="true"
                          buttonLayout="horizontal"
                          incrementButtonIcon="pi pi-plus"
                          decrementButtonIcon="pi pi-minus"
                          (ngModelChange)="calculateTotalFromEntries()"
                          styleClass="table-input-number"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          [(ngModel)]="entry.description"
                          [name]="'entryDesc' + i"
                          class="table-input"
                          placeholder="รายละเอียดงานที่ทำ"
                        />
                      </td>
                      <td class="action-cell">
                        <button
                          pButton
                          type="button"
                          icon="pi pi-trash"
                          class="p-button-sm p-button-danger p-button-text"
                          (click)="removeHoursEntry(i)"
                        ></button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="hours-summary">
                  <span class="summary-label">รวมชั่วโมงจากรายการ:</span>
                  <span class="summary-value">{{ getTotalHoursFromEntries() }} ชั่วโมง</span>
                </div>
              </div>

              <div class="empty-state" *ngIf="hoursEntries.length === 0">
                <i class="pi pi-calendar" style="font-size: 2rem; color: #ccc;"></i>
                <p>ยังไม่มีรายการบันทึกชั่วโมง</p>
                <small>คลิก "เพิ่มรายการ" เพื่อเริ่มบันทึก</small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">วันที่เริ่มฝึก</label>
                <input
                  type="date"
                  id="startDate"
                  [(ngModel)]="startDateString"
                  name="startDate"
                  class="date-input"
                  placeholder="เลือกวันที่"
                />
              </div>

              <div class="form-group">
                <label for="endDate">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  id="endDate"
                  [(ngModel)]="endDateString"
                  name="endDate"
                  class="date-input"
                  placeholder="เลือกวันที่"
                />
              </div>
            </div>

            <div class="form-actions">
              <button
                pButton
                type="submit"
                label="บันทึกข้อมูล"
                icon="pi pi-check"
                [disabled]="!evidenceForm.valid || isSubmitting"
                [loading]="isSubmitting"
                class="submit-btn"
              ></button>
            </div>
          </form>
        </div>

        <!-- Calculation Card -->
        <div class="glass-panel calculation-card">
          <h3>ผลการคำนวณ</h3>
          
          <div class="calculation-details">
            <div class="calc-row">
              <span class="calc-label">ชั่วโมงฝึกทั้งหมด:</span>
              <span class="calc-value">{{ formData.total_training_hours || 0 }} ชม.</span>
            </div>
            
            <div class="calc-row deduction">
              <span class="calc-label">หัก: วันขาดงาน ({{ formData.absence_days || 0 }} วัน):</span>
              <span class="calc-value">-{{ (formData.absence_days || 0) * 8 }} ชม.</span>
            </div>
            
            <div class="calc-row deduction">
              <span class="calc-label">หัก: วันลา ({{ formData.leave_days || 0 }} วัน):</span>
              <span class="calc-value">-{{ (formData.leave_days || 0) * 8 }} ชม.</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="calc-row total">
              <span class="calc-label">ชั่วโมงสุทธิ:</span>
              <span class="calc-value highlight">{{ calculatedHours }} ชม.</span>
            </div>

            <div class="calc-row">
              <span class="calc-label">ชั่วโมงที่ต้องการ (80%):</span>
              <span class="calc-value">448 ชม.</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span>ความคืบหน้า</span>
              <span class="percentage">{{ percentage }}%</span>
            </div>
            <p-progressBar 
              [value]="percentage" 
              [showValue]="false"
              [style]="{'height': '12px'}"
            />
          </div>

          <div class="status-badge" [ngClass]="statusClass">
            <i [class]="statusIcon"></i>
            <span>{{ statusText }}</span>
          </div>

          <div class="info-box" [ngClass]="statusClass">
            <i class="pi pi-info-circle"></i>
            <p>{{ statusMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-header p {
      color: var(--text-muted);
      font-size: 1rem;
    }

    .icon {
      font-size: 1.8rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 968px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .glass-panel h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--primary-light);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .required {
      color: #e74c3c;
    }

    .helper-text {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    /* Hours Log Section Styles */
    .hours-log-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background: rgba(66, 133, 244, 0.05);
      border-radius: 12px;
      border: 2px dashed rgba(66, 133, 244, 0.3);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary);
    }

    .hours-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .hours-table thead {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
    }

    .hours-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .hours-table td {
      padding: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .entry-row:hover {
      background: rgba(66, 133, 244, 0.03);
    }

    .table-input,
    .date-input-sm {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .table-input:focus,
    .date-input-sm:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
    }

    .action-cell {
      text-align: center;
    }

    .hours-summary {
      margin-top: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-label {
      font-weight: 600;
      color: var(--text-primary);
    }

    .summary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted);
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-weight: 600;
    }

    .empty-state small {
      color: #999;
    }

    ::ng-deep .table-input-number .p-inputnumber {
      width: 100%;
    }

    ::ng-deep .table-input-number .p-inputnumber-input {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    ::ng-deep .table-input-number .p-inputnumber-button {
      width: 2rem;
    }

    .form-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .submit-btn {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border: none;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .calculation-details {
      margin-bottom: 1.5rem;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      font-size: 1rem;
    }

    .calc-row.deduction {
      color: #e74c3c;
    }

    .calc-row.total {
      font-size: 1.25rem;
      font-weight: 700;
      padding: 1rem 0;
    }

    .calc-label {
      color: var(--text-secondary);
    }

    .calc-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .calc-value.highlight {
      color: var(--primary);
      font-size: 1.5rem;
    }

    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
      margin: 0.5rem 0;
    }

    .progress-section {
      margin: 1.5rem 0;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .percentage {
      color: var(--primary);
      font-size: 1.1rem;
    }

    .status-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 1.5rem 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .status-badge.passed {
      background: linear-gradient(135deg, #00c851 0%, #007e33 100%);
      color: white;
    }

    .status-badge.failed {
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      color: white;
    }

    .status-badge.pending {
      background: linear-gradient(135deg, #ffbb33 0%, #ff8800 100%);
      color: white;
    }

    .status-icon {
      font-size: 1.5rem;
    }

    .info-box {
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .info-box.passed {
      background: rgba(0, 200, 81, 0.1);
      border-left: 4px solid #00c851;
      color: #007e33;
    }

    .info-box.failed {
      background: rgba(255, 68, 68, 0.1);
      border-left: 4px solid #ff4444;
      color: #cc0000;
    }

    .info-box.pending {
      background: rgba(255, 187, 51, 0.1);
      border-left: 4px solid #ffbb33;
      color: #ff8800;
    }

    .info-box i {
      font-size: 1.2rem;
      margin-top: 0.1rem;
    }

    ::ng-deep .p-inputnumber,
    ::ng-deep .p-calendar {
      width: 100%;
    }

    .date-input,
    ::ng-deep .p-inputnumber-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .date-input:focus,
    ::ng-deep .p-inputnumber-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
      outline: none;
    }

    ::ng-deep .p-progressbar {
      border-radius: 6px;
      overflow: hidden;
    }

    ::ng-deep .p-progressbar-value {
      background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    }
  `]
})
export class TrainingEvidenceComponent implements OnInit {
  formData: TrainingEvidenceData = {
    total_training_hours: 0,
    absence_days: 0,
    leave_days: 0,
    start_date: undefined,
    end_date: undefined
  };

  // String representations for HTML date inputs
  startDateString: string = '';
  endDateString: string = '';

  calculatedHours: number = 0;
  percentage: number = 0;
  statusClass: string = 'pending';
  statusText: string = 'รอการประเมิน';
  statusIcon: string = 'pi pi-clock';
  statusMessage: string = 'กรุณากรอกข้อมูลเพื่อดูผลการประเมิน';
  isSubmitting: boolean = false;

  // TODO: Get actual intern ID from auth service or route params
  internId: number = 1;

  // Hours entries for daily log
  hoursEntries: HoursEntry[] = [];

  constructor(
    private trainingEvidenceService: TrainingEvidenceService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadExistingData();
  }

  addHoursEntry(): void {
    this.hoursEntries.push({
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      description: ''
    });
  }

  removeHoursEntry(index: number): void {
    this.hoursEntries.splice(index, 1);
    this.calculateTotalFromEntries();
  }

  getTotalHoursFromEntries(): number {
    return this.hoursEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  }

  calculateTotalFromEntries(): void {
    const total = this.getTotalHoursFromEntries();
    this.formData.total_training_hours = total;
    this.calculateHours();
  }

  loadExistingData(): void {
    this.trainingEvidenceService.getTrainingEvidence(this.internId).subscribe({
      next: (response) => {
        if (response.success && response.data.total_training_hours) {
          this.formData = {
            total_training_hours: response.data.total_training_hours,
            absence_days: response.data.absence_days,
            leave_days: response.data.leave_days,
            start_date: response.data.start_date ? new Date(response.data.start_date) : undefined,
            end_date: response.data.end_date ? new Date(response.data.end_date) : undefined
          };
          this.calculateHours();
        }
      },
      error: (error) => {
        console.error('Error loading training evidence:', error);
      }
    });
  }

  calculateHours(): void {
    const hoursPerDay = 8;
    this.calculatedHours = (this.formData.total_training_hours || 0)
      - ((this.formData.absence_days || 0) * hoursPerDay)
      - ((this.formData.leave_days || 0) * hoursPerDay);

    // Ensure non-negative
    this.calculatedHours = Math.max(0, this.calculatedHours);

    // Calculate percentage
    this.percentage = Math.min(100, Math.round((this.calculatedHours / 560) * 100));

    // Determine status
    const requiredHours = 448;
    if (this.calculatedHours >= requiredHours) {
      this.statusClass = 'passed';
      this.statusText = 'ผ่านเกณฑ์';
      this.statusIcon = 'pi pi-check-circle';
      this.statusMessage = `ยินดีด้วย! คุณมีชั่วโมงการฝึกงานเพียงพอ (${this.calculatedHours} ชม. จาก 448 ชม. ที่ต้องการ)`;
    } else {
      this.statusClass = 'failed';
      this.statusText = 'ไม่ผ่านเกณฑ์';
      this.statusIcon = 'pi pi-times-circle';
      this.statusMessage = `ชั่วโมงการฝึกงานไม่เพียงพอ ต้องการอีก ${requiredHours - this.calculatedHours} ชั่วโมง`;
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Use date strings directly from inputs
    const submitData = {
      ...this.formData,
      start_date: this.startDateString || undefined,
      end_date: this.endDateString || undefined
    };

    this.trainingEvidenceService.submitTrainingEvidence(this.internId, submitData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: response.message || 'บันทึกข้อมูลเรียบร้อยแล้ว',
          life: 3000
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: error.error?.message || 'ไม่สามารถบันทึกข้อมูลได้',
          life: 3000
        });
      }
    });
  }
}
