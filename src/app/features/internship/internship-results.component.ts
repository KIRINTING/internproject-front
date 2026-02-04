import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternshipService, InternshipRequest } from './services/internship';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-internship-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="results-container">
      <div class="page-header">
        <h2>📋 ผลการพิจารณาคำขอฝึกงาน</h2>
        <p>ตรวจสอบสถานะและผลการพิจารณาคำขอฝึกงานของคุณ</p>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div *ngIf="!isLoading && !internshipRequest" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>ยังไม่มีคำขอฝึกงาน</h3>
        <p>คุณยังไม่ได้ส่งคำขอฝึกงาน กรุณาส่งคำขอฝึกงานก่อน</p>
        <a routerLink="/internship/requests" class="btn-primary">ส่งคำขอฝึกงาน</a>
      </div>

      <div *ngIf="!isLoading && internshipRequest" class="results-content">
        <!-- Status Card -->
        <div class="status-card" [ngClass]="getStatusClass()">
          <div class="status-icon">{{ getStatusIcon() }}</div>
          <div class="status-info">
            <h3>{{ getStatusTitle() }}</h3>
            <p>{{ getStatusMessage() }}</p>
          </div>
        </div>

        <!-- Request Details -->
        <div class="details-card">
          <h3>ข้อมูลคำขอ</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">รหัสคำขอ:</span>
              <span class="value">{{ internshipRequest.intern_id }}</span>
            </div>
            <div class="detail-item">
              <span class="label">ชื่อ-นามสกุล:</span>
              <span class="value">{{ internshipRequest.title }} {{ internshipRequest.first_name }} {{ internshipRequest.last_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">บริษัท:</span>
              <span class="value">{{ internshipRequest.company_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">ตำแหน่ง:</span>
              <span class="value">{{ internshipRequest.position }}</span>
            </div>
            <div class="detail-item">
              <span class="label">วันที่ส่งคำขอ:</span>
              <span class="value">{{ internshipRequest.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">สถานะ:</span>
              <span class="value status-badge" [ngClass]="getStatusClass()">{{ getStatusLabel() }}</span>
            </div>
          </div>
        </div>

        <!-- Rejection Reason (if rejected) -->
        <div *ngIf="internshipRequest.status === 'rejected' && internshipRequest.rejection_reason" class="rejection-card">
          <h3>⚠️ เหตุผลในการปฏิเสธ</h3>
          <p class="rejection-reason">{{ internshipRequest.rejection_reason }}</p>
        </div>

        <!-- Approval Details (if approved) -->
        <div *ngIf="internshipRequest.status === 'officer_approved' || internshipRequest.status === 'dean_approved'" class="approval-card">
          <h3>✅ รายละเอียดการอนุมัติ</h3>
          <div class="approval-timeline">
            <div class="timeline-item completed">
              <div class="timeline-marker">✓</div>
              <div class="timeline-content">
                <h4>อนุมัติโดยเจ้าหน้าที่</h4>
                <p>ผ่านการพิจารณาจากเจ้าหน้าที่แล้ว</p>
              </div>
            </div>
            <div class="timeline-item" [ngClass]="internshipRequest.status === 'dean_approved' ? 'completed' : 'pending'">
              <div class="timeline-marker">{{ internshipRequest.status === 'dean_approved' ? '✓' : '⏳' }}</div>
              <div class="timeline-content">
                <h4>{{ internshipRequest.status === 'dean_approved' ? 'อนุมัติโดยคณบดี' : 'รอการอนุมัติจากคณบดี' }}</h4>
                <p>{{ internshipRequest.status === 'dean_approved' ? 'ผ่านการอนุมัติจากคณบดีแล้ว' : 'อยู่ระหว่างรอการอนุมัติจากคณบดี' }}</p>
              </div>
            </div>
          </div>

          <div class="action-buttons" *ngIf="internshipRequest.pdf_path">
            <button class="btn-download" (click)="downloadPdf()">
              📄 ดาวน์โหลดเอกสารอนุมัติ
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }

    .page-header p {
      color: #666;
      font-size: 1rem;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4285f4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
    }

    .results-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      border-radius: 16px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .status-card.pending {
      border-left: 6px solid #ff9800;
      background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
    }

    .status-card.approved {
      border-left: 6px solid #00c851;
      background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    }

    .status-card.rejected {
      border-left: 6px solid #ea4335;
      background: linear-gradient(135deg, #ffebee 0%, #ffffff 100%);
    }

    .status-icon {
      font-size: 3rem;
    }

    .status-info h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .status-info p {
      color: #666;
      font-size: 1rem;
    }

    .details-card, .rejection-card, .approval-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .details-card h3, .rejection-card h3, .approval-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: #1a1a1a;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item .label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .detail-item .value {
      font-size: 1rem;
      color: #1a1a1a;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-badge.pending {
      background: #ff9800;
      color: white;
    }

    .status-badge.approved {
      background: #00c851;
      color: white;
    }

    .status-badge.rejected {
      background: #ea4335;
      color: white;
    }

    .rejection-reason {
      padding: 1rem;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 8px;
      color: #856404;
      line-height: 1.6;
    }

    .approval-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .timeline-item {
      display: flex;
      gap: 1rem;
      position: relative;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 15px;
      top: 40px;
      width: 2px;
      height: calc(100% + 1rem);
      background: #e0e0e0;
    }

    .timeline-item.completed::after {
      background: #00c851;
    }

    .timeline-marker {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      background: #e0e0e0;
      color: #666;
    }

    .timeline-item.completed .timeline-marker {
      background: #00c851;
      color: white;
    }

    .timeline-item.pending .timeline-marker {
      background: #ff9800;
      color: white;
    }

    .timeline-content h4 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
      color: #1a1a1a;
    }

    .timeline-content p {
      font-size: 0.875rem;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-primary, .btn-download {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4285f4 0%, #1967d2 100%);
      color: white;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
    }

    .btn-download {
      background: linear-gradient(135deg, #00c851 0%, #007e33 100%);
      color: white;
    }

    .btn-download:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 200, 81, 0.3);
    }
  `]
})
export class InternshipResultsComponent implements OnInit {
  internshipRequest: InternshipRequest | null = null;
  isLoading = true;

  constructor(
    private internshipService: InternshipService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadInternshipRequest();
  }

  loadInternshipRequest(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Results page - Current user:', currentUser);

    if (currentUser && currentUser.username) {
      console.log('Results page - Fetching internship for:', currentUser.username);

      this.internshipService.getMyInternship(currentUser.username).subscribe({
        next: (response) => {
          console.log('Results page - Internship response:', response);
          if (response.success && response.data) {
            this.internshipRequest = response.data;
            console.log('Results page - Internship request set:', this.internshipRequest);
          } else {
            console.log('Results page - No data in response');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Results page - Error loading internship request:', error);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Results page - No user or username');
      this.isLoading = false;
    }
  }

  getStatusClass(): string {
    if (!this.internshipRequest) return '';

    switch (this.internshipRequest.status) {
      case 'pending':
        return 'pending';
      case 'officer_approved':
      case 'dean_approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return '';
    }
  }

  getStatusIcon(): string {
    if (!this.internshipRequest) return '';

    switch (this.internshipRequest.status) {
      case 'pending':
        return '⏳';
      case 'officer_approved':
      case 'dean_approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📝';
    }
  }

  getStatusTitle(): string {
    if (!this.internshipRequest) return '';

    switch (this.internshipRequest.status) {
      case 'pending':
        return 'รอการพิจารณา';
      case 'officer_approved':
        return 'ผ่านการพิจารณา';
      case 'dean_approved':
        return 'อนุมัติเรียบร้อย';
      case 'rejected':
        return 'ไม่ผ่านการพิจารณา';
      default:
        return 'ไม่ทราบสถานะ';
    }
  }

  getStatusMessage(): string {
    if (!this.internshipRequest) return '';

    switch (this.internshipRequest.status) {
      case 'pending':
        return 'คำขอของคุณอยู่ระหว่างการพิจารณาจากเจ้าหน้าที่';
      case 'officer_approved':
        return 'คำขอของคุณผ่านการพิจารณาจากเจ้าหน้าที่แล้ว กำลังรอการอนุมัติจากคณบดี';
      case 'dean_approved':
        return 'คำขอของคุณได้รับการอนุมัติเรียบร้อยแล้ว คุณสามารถเริ่มฝึกงานได้';
      case 'rejected':
        return 'คำขอของคุณไม่ผ่านการพิจารณา กรุณาตรวจสอบเหตุผลและส่งคำขอใหม่';
      default:
        return '';
    }
  }

  getStatusLabel(): string {
    if (!this.internshipRequest) return '';

    switch (this.internshipRequest.status) {
      case 'pending':
        return 'รอการพิจารณา';
      case 'officer_approved':
        return 'อนุมัติโดยเจ้าหน้าที่';
      case 'dean_approved':
        return 'อนุมัติเรียบร้อย';
      case 'rejected':
        return 'ปฏิเสธ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  }

  downloadPdf(): void {
    if (!this.internshipRequest?.id) return;

    this.internshipService.downloadPdf(this.internshipRequest.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `internship_approval_${this.internshipRequest!.intern_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert('ไม่สามารถดาวน์โหลดเอกสารได้');
      }
    });
  }
}
