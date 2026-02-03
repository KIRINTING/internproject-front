import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-criteria-check',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">✅</span> Criteria Check</h2>
        <p>Upload evidence to verify your internship prerequisites.</p>
      </div>

      <div class="glass-panel content-card">
        <ul class="criteria-list">
          <li class="criteria-item completed">
            <span class="status-icon">✔️</span>
            <div class="criteria-content">
              <h4>Passed Pre-internship Course</h4>
              <p>Verified on Jan 10, 2026</p>
            </div>
          </li>
          <li class="criteria-item completed">
            <span class="status-icon">✔️</span>
            <div class="criteria-content">
              <h4>GPA > 2.00</h4>
              <p>Current GPA: 3.50</p>
            </div>
          </li>
          <li class="criteria-item pending">
            <span class="status-icon">📤</span>
            <div class="criteria-content">
              <h4>English Proficiency Test</h4>
              <p>Please upload your test scores.</p>
              <button class="btn btn-sm btn-primary upload-btn">Upload PDF</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .content-card { padding: 2rem; }
    
    .criteria-list { list-style: none; padding: 0; }
    
    .criteria-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: rgba(255,255,255,0.02);
      margin-bottom: 1rem;
      border-radius: 12px;
      border: 1px solid transparent;
    }

    .criteria-item.completed {
      border-color: rgba(0, 200, 81, 0.3);
      background: rgba(0, 200, 81, 0.05);
    }

    .criteria-item.pending {
      border-color: rgba(130, 87, 229, 0.3);
    }

    .status-icon { font-size: 1.5rem; }
    
    .criteria-content h4 { margin: 0 0 0.25rem 0; }
    .criteria-content p { margin: 0; font-size: 0.9rem; color: var(--text-muted); }

    .upload-btn { margin-top: 10px; }
  `]
})
export class CriteriaCheckComponent { }
