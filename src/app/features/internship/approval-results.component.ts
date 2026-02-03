import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-approval-results',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">📢</span> Approval Results</h2>
        <p>Check the status of your internship request.</p>
      </div>

      <div class="status-card glass-panel approved">
        <div class="status-icon">✅</div>
        <div class="status-content">
          <h3>Approved</h3>
          <p>Your request to intern at <strong>Tech Solutions Co., Ltd.</strong> has been approved.</p>
          <div class="status-meta">
            <span>Date: Feb 1, 2026</span>
            <span>Approver: Dr. Officer Name</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm">Download Letter</button>
      </div>

       <!-- Mock Pending State (Commented out for demo)
      <div class="status-card glass-panel pending">
        <div class="status-icon">⏳</div>
        <div class="status-content">
          <h3>Pending Review</h3>
          <p>Your request is currently being reviewed by the department.</p>
        </div>
      </div>
      -->
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border-left: 5px solid;
    }

    .status-card.approved {
      border-color: #00c851;
      background: linear-gradient(90deg, rgba(0, 200, 81, 0.1) 0%, transparent 100%);
    }

    .status-card.pending {
      border-color: #ffbb33;
      background: linear-gradient(90deg, rgba(255, 187, 51, 0.1) 0%, transparent 100%);
    }

    .status-card.rejected {
      border-color: #ff4444;
      background: linear-gradient(90deg, rgba(255, 68, 68, 0.1) 0%, transparent 100%);
    }

    .status-icon {
      font-size: 2rem;
      background: rgba(255,255,255,0.1);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .status-content {
      flex: 1;
    }

    .status-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }

    .status-meta {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      display: flex;
      gap: 1.5rem;
    }
  `]
})
export class ApprovalResultsComponent { }
