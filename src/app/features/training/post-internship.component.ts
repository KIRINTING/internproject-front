import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-post-internship',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">🎓</span> Post-Internship Orientation</h2>
        <p>Documents and materials for the post-internship session.</p>
      </div>

      <div class="glass-panel content-card">
        <div class="pdf-viewer-placeholder">
           <div class="icon">📄</div>
           <p>PDF Preview</p>
           <small>Orientation_Slides_2026.pdf</small>
        </div>
        
        <div class="actions">
          <h3>Orientation Materials</h3>
          <p>Please review the attached documents before the session.</p>
          <div class="btn-group">
            <button class="btn btn-primary">Download PDF</button>
            <button class="btn btn-ghost">Open in New Tab</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    
    .content-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .pdf-viewer-placeholder {
      background: rgba(0,0,0,0.3);
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }
    
    .icon { font-size: 3rem; margin-bottom: 1rem; }

    .actions { padding: 2rem; }
    .actions h3 { margin-top: 0; }
    
    .btn-group { display: flex; gap: 1rem; margin-top: 1rem; }
  `]
})
export class PostInternshipComponent { }
