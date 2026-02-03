import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupervisorService } from '../services/supervisor.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-supervisor-assessment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="assessment-container">
      <div class="header">
        <button (click)="goBack()" class="btn-back">
          ← กลับ
        </button>
        <h1>แบบประเมินผลนักศึกษาฝึกงาน (สำหรับผู้นิเทศงาน)</h1>
      </div>

      <div class="form-card">
        <div class="student-summary" *ngIf="studentId">
          <h3>รหัสนักศึกษา: {{ studentId }}</h3>
        </div>

        <form (ngSubmit)="submitAssessment()" #assessmentForm="ngForm">
          <div class="score-section">
            <h3>ส่วนที่ 1: การประเมินผลการปฏิบัติงานจริง (50 คะแนน)</h3>
            
            <div class="score-item">
              <label>1.1 ปริมาณงานที่ปฏิบัติ (10)</label>
              <input type="number" [(ngModel)]="scores.quantity" name="quantity" min="0" max="10" required class="score-input">
            </div>

            <div class="score-item">
              <label>1.2 คุณภาพของงาน (10)</label>
              <input type="number" [(ngModel)]="scores.quality" name="quality" min="0" max="10" required class="score-input">
            </div>

            <div class="score-item">
              <label>1.3 ความรู้ความสามารถในการปฏิบัติงาน (10)</label>
              <input type="number" [(ngModel)]="scores.knowledge" name="knowledge" min="0" max="10" required class="score-input">
            </div>

             <div class="score-item">
              <label>1.4 การปรับตัวและการเรียนรู้ (10)</label>
              <input type="number" [(ngModel)]="scores.adaptability" name="adaptability" min="0" max="10" required class="score-input">
            </div>

             <div class="score-item">
              <label>1.5 ทัศนคติและพฤติกรรม (10)</label>
              <input type="number" [(ngModel)]="scores.attitude" name="attitude" min="0" max="10" required class="score-input">
            </div>
          </div>

          <div class="comment-section">
             <h3>ส่วนที่ 2: ความคิดเห็นเพิ่มเติม</h3>
             <textarea [(ngModel)]="comments" name="comments" rows="5" class="comment-input" placeholder="จุดเด่น, จุดที่ควรปรับปรุง..."></textarea>
          </div>

          <div class="actions">
            <button type="button" (click)="goBack()" class="btn-cancel">ยกเลิก</button>
            <button type="submit" class="btn-submit" [disabled]="!assessmentForm.form.valid || isSubmitting">
              {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลการประเมิน' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .assessment-container {
      padding: 2rem;
      background-color: #f5f7fa;
      min-height: 100vh;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .header h1 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .btn-back {
      background: none;
      border: none;
      font-size: 1rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
    }

    .form-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .student-summary {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .score-section {
      margin-bottom: 2rem;
    }

    .score-section h3, .comment-section h3 {
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      background: #fbecec;
      padding: 0.8rem;
      border-radius: 6px;
    }

    .score-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.5rem 0;
    }

    .score-item label {
      flex: 1;
      color: #444;
    }

    .score-input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      text-align: center;
    }

    .comment-input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      resize: vertical;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    .btn-cancel {
      padding: 0.8rem 1.5rem;
      background: #f1f1f1;
      border: none;
      border-radius: 6px;
      color: #666;
      cursor: pointer;
    }

    .btn-submit {
      padding: 0.8rem 1.5rem;
      background: linear-gradient(135deg, #e24a4a 0%, #bd3535 100%);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-weight: 500;
      box-shadow: 0 4px 10px rgba(226, 74, 74, 0.3);
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class SupervisorAssessmentComponent implements OnInit {
    studentId: string | null = null;
    currentUser: any;

    scores = {
        quantity: null,
        quality: null,
        knowledge: null,
        adaptability: null,
        attitude: null
    };
    comments: string = '';
    isSubmitting = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supervisorService: SupervisorService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.studentId = this.route.snapshot.paramMap.get('id');
        this.currentUser = this.authService.getCurrentUser();
    }

    goBack() {
        this.router.navigate(['/supervisor/dashboard']);
    }

    submitAssessment() {
        if (!this.studentId || !this.currentUser) return;

        this.isSubmitting = true;

        const assessmentData = {
            student_id: this.studentId,
            evaluator_id: this.currentUser.id, // Or supervisor_id
            evaluator_type: 'supervisor',
            scores: this.scores,
            comments: this.comments,
            evaluation_date: new Date().toISOString().split('T')[0]
        };

        this.supervisorService.submitAssessment(assessmentData).subscribe({
            next: (res) => {
                alert('บันทึกผลการประเมินเรียบร้อยแล้ว');
                this.goBack();
            },
            error: (err) => {
                console.error(err);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                this.isSubmitting = false;
            }
        });
    }
}
