import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FormDoc {
    id: number;
    name: string;
    description: string;
    size: string;
}

@Component({
    selector: 'app-download-forms',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">📄</span> Download Forms</h2>
        <p>Official documents and forms for internship preparation.</p>
      </div>

      <div class="forms-grid">
        <div class="form-card glass-panel" *ngFor="let doc of documents">
          <div class="doc-icon">PDF</div>
          <div class="doc-info">
            <h4>{{ doc.name }}</h4>
            <p>{{ doc.description }}</p>
            <span class="meta-tag">{{ doc.size }}</span>
          </div>
          <button class="btn btn-ghost doc-action" title="Download">⬇</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .forms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      transition: transform 0.2s ease, background 0.2s;
    }

    .form-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.08);
    }

    .doc-icon {
      background: #ff4757;
      color: white;
      font-weight: 700;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.9rem;
      box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3);
    }

    .doc-info {
      flex: 1;
    }

    .doc-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .meta-tag {
      font-size: 0.75rem;
      color: var(--text-muted);
      background: rgba(255,255,255,0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .doc-action {
      background: rgba(255, 255, 255, 0.05);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .doc-action:hover {
      background: var(--primary);
    }
  `]
})
export class DownloadFormsComponent {
    documents: FormDoc[] = [
        { id: 1, name: 'แบบคำร้องขอฝึกงาน (Intern Request)', description: 'Form for requesting internship placement.', size: '1.2 MB' },
        { id: 2, name: 'หนังสืออนุญาตจากผู้ปกครอง', description: 'Parental consent form.', size: '0.8 MB' },
        { id: 3, name: 'แบบประเมินตนเอง', description: 'Self-assessment form before internship.', size: '0.5 MB' }
    ];
}
