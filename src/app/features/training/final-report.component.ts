import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternshipService } from '../internship/services/internship';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">📊</span> ส่งรายงานการฝึกงาน</h2> <!-- Translate to Thai -->
        <p>ส่งไฟล์รายงานฉบับสมบูรณ์และไฟล์นำเสนอ (Presentation) ของคุณ</p>
      </div>

      <div class="glass-panel upload-card">
        <div 
          class="upload-area" 
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          [class.drag-over]="isDragging">
          
          <input #fileInput type="file" multiple (change)="onFileSelected($event)" hidden accept=".pdf,.docx,.pptx,.ppt">
          <div class="upload-icon">☁️</div>
          <h3>ลากและวางไฟล์ที่นี่</h3>
          <p>หรือคลิกเพื่อเลือกไฟล์</p>
          <small>รองรับไฟล์: PDF, DOCX, PPTX (สูงสุด 20MB)</small>
        </div>

        <div class="file-list" *ngIf="files.length > 0">
          <h4>ไฟล์ที่เลือก:</h4>
          <div *ngFor="let file of files; let i = index" class="file-item animate-slide-up">
            <div class="file-info">
              <span class="file-icon">{{ getFileIcon(file.name) }}</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</span>
            </div>
            <button class="btn-remove" (click)="removeFile(i)">✕</button>
          </div>
        </div>

        <div class="file-list" *ngIf="files.length === 0">
           <h4>ไฟล์ที่อัปโหลดแล้ว:</h4>
           <p class="empty-state" *ngIf="!uploadedReport && !uploadedPresentation">ยังไม่มีไฟล์ที่อัปโหลด</p>
           
           <div *ngIf="uploadedReport" class="file-item existing-file">
              <div class="file-info">
                 <span class="file-icon">📄</span>
                 <span class="file-name">Final Report (Uploaded)</span>
                 <span class="upload-date">เมื่อ: {{ reportSubmittedAt | date:'medium' }}</span>
              </div>
           </div>
           
           <div *ngIf="uploadedPresentation" class="file-item existing-file">
              <div class="file-info">
                 <span class="file-icon">📊</span>
                 <span class="file-name">Presentation (Uploaded)</span>
              </div>
           </div>
        </div>

        <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>
        <div class="success-msg" *ngIf="successMessage">{{ successMessage }}</div>

        <div class="actions">
          <button class="btn btn-primary" (click)="uploadFiles()" [disabled]="files.length === 0 || isUploading">
            {{ isUploading ? 'กำลังอัปโหลด...' : 'ส่งรายงาน' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { font-size: 2rem; color: var(--text-main); margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-muted); }
    
    .upload-card { padding: 2rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); }

    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--bg-hover);
    }

    .upload-area:hover, .upload-area.drag-over {
      border-color: var(--primary);
      background: rgba(157, 78, 221, 0.05); /* very light purple */
    }

    .upload-icon { font-size: 3rem; margin-bottom: 1rem; }
    .upload-area h3 { margin: 0 0 0.5rem 0; color: var(--text-main); }
    .upload-area p { margin: 0 0 1rem 0; color: var(--text-muted); }
    .upload-area small { color: var(--text-muted); font-size: 0.8rem; }

    .file-list { margin-top: 2rem; }
    .file-list h4 { color: var(--text-main); margin-bottom: 1rem; }
    .empty-state { color: var(--text-muted); font-style: italic; }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .file-info { display: flex; align-items: center; gap: 0.75rem; }
    .file-name { font-weight: 500; color: var(--text-main); word-break: break-all; }
    .file-size { color: var(--text-muted); font-size: 0.85rem; }
    .btn-remove { background: none; border: none; color: var(--danger); font-size: 1.2rem; cursor: pointer; }

    .existing-file { background: #f0fdf4; border-color: #bbf7d0; }
    .upload-date { font-size: 0.8rem; color: #166534; margin-left: 0.5rem; }

    .actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
    
    .error-msg { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid #fecaca; }
    .success-msg { background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid #bbf7d0; }
  `]
})
export class FinalReportComponent implements OnInit {
  isDragging = false;
  files: File[] = [];
  isUploading = false;
  errorMessage = '';
  successMessage = '';

  internshipId: number | null = null;
  uploadedReport = false;
  uploadedPresentation = false;
  reportSubmittedAt: string | null = null;

  constructor(
    private internshipService: InternshipService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadInternshipData();
  }

  loadInternshipData() {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      this.internshipService.getMyInternship(user.username).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.internshipId = response.data.id;
            this.uploadedReport = !!response.data.final_report_path;
            this.uploadedPresentation = !!response.data.presentation_path;
            this.reportSubmittedAt = response.data.report_submitted_at;
          }
        },
        error: (err) => console.error('Failed to load internship', err)
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.handleFiles(droppedFiles);
    }
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      this.handleFiles(selectedFiles);
    }
  }

  handleFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'];

      // Simple check extension for looser validation
      const isValidExt = file.name.match(/\.(pdf|docx|doc|pptx|ppt)$/i);

      if (isValidExt && file.size <= 20 * 1024 * 1024) { // 20MB
        // Replace if same type exists or just add to list (limit to 2 files: report and presentation)
        // Heuristic: PDF/DOC -> Report, PPT -> Presentation
        this.files.push(file);
      } else {
        this.errorMessage = `ไฟล์ ${file.name} ไม่รองรับ หรือมีขนาดใหญ่เกิน 20MB`;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    }
    // Limit to 2 recent files
    if (this.files.length > 2) {
      this.files = this.files.slice(this.files.length - 2);
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  getFileIcon(filename: string): string {
    if (filename.endsWith('.pdf')) return '📄';
    if (filename.match(/\.docx?$/)) return '📝';
    if (filename.match(/\.pptx?$/)) return '📊';
    return '📁';
  }

  uploadFiles() {
    if (!this.internshipId) {
      this.errorMessage = 'ไม่พบข้อมูลการฝึกงานของคุณ';
      return;
    }

    if (this.files.length === 0) return;

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Identify which file is which
    let reportFile: File | undefined = undefined;
    let presentationFile: File | undefined = undefined;

    // Simple heuristic: PPT is presentation, others are report. 
    // If 2 files, one PPT one non-PPT -> easy.
    // If manually selecting, we assume the user knows. 
    // Ideally we should have separate inputs, but for single drag drop area:

    this.files.forEach(f => {
      if (f.name.match(/\.pptx?$/i)) {
        presentationFile = f;
      } else {
        reportFile = f; // Assume PDF/Doc is report
      }
    });

    if (!reportFile && !presentationFile) {
      this.isUploading = false;
      this.errorMessage = 'กรุณาอัปโหลดไฟล์รายงานหรือไฟล์นำเสนอ';
      return;
    }

    // If we have a presentation but no report file variable assigned (because maybe user uploaded only PPT), 
    // we should be careful. 
    // But let's assume if only one file and it's PPT, it's presentation. If only one and it's PDF, it's report.
    // If user uploaded 2 PDFs, we take the last one as report? 
    // For now, this heuristic is acceptable: PPT -> Presentation, else -> Report.

    // If reportFile is undefined but we have files, and none matched PPT, then they are all report candidates.
    // If we have multiple report candidates, take the first one.
    if (!reportFile && this.files.length > 0 && !presentationFile) {
      reportFile = this.files[0];
    }

    // Safety check
    if (!reportFile && !presentationFile) {
      // Should not happen given logic above
      this.isUploading = false;
      return;
    }

    // Force cast to File for the service call which expects File
    this.internshipService.submitReport(this.internshipId, reportFile!, presentationFile).subscribe({
      next: (res) => {
        this.successMessage = 'อัปโหลดรายงานเรียบร้อยแล้ว!';
        this.isUploading = false;
        this.files = []; // Clear selection
        this.loadInternshipData(); // Refresh list
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง';
        this.isUploading = false;
      }
    });
  }
}
