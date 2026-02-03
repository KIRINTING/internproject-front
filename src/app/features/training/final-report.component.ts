import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-final-report',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">📊</span> Final Report Submission</h2>
        <p>Submit your final internship report and presentation files.</p>
      </div>

      <div class="glass-panel upload-card">
        <div class="upload-area" (click)="fileInput.click()">
          <input #fileInput type="file" hidden>
          <div class="upload-icon">☁️</div>
          <h3>Drag & Drop your files here</h3>
          <p>or click to browse</p>
          <small>Supported formats: PDF, DOCX, PPTX (Max 50MB)</small>
        </div>

        <div class="file-list">
          <h4>Uploaded Files</h4>
          <p class="empty-state">No files uploaded yet.</p>
        </div>

        <div class="actions">
          <button class="btn btn-primary" disabled>Submit Report</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    
    .upload-card { padding: 2rem; }

    .upload-area {
      border: 2px dashed var(--glass-border);
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(255,255,255,0.02);
    }

    .upload-area:hover {
      border-color: var(--primary);
      background: rgba(255,255,255,0.05);
    }

    .upload-icon { font-size: 3rem; margin-bottom: 1rem; }
    
    .upload-area h3 { margin: 0 0 0.5rem 0; }
    .upload-area p { margin: 0 0 1rem 0; color: var(--text-muted); }
    .upload-area small { color: var(--text-muted); font-size: 0.8rem; }

    .file-list { margin-top: 2rem; }
    .empty-state { color: var(--text-muted); font-style: italic; }

    .actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
  `]
})
export class FinalReportComponent { }
