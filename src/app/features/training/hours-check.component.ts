import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hours-check',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">⏱️</span> Internship Hours & Evaluations</h2>
        <p>Track your accumulated hours and supervisor evaluations.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass-panel">
          <h3>Total Hours</h3>
          <div class="value">320 / 450</div>
          <div class="progress-bar">
            <div class="progress" style="width: 71%"></div>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <h3>Evaluations</h3>
          <div class="value">2 / 4</div>
          <p class="sub-text">Submitted by Supervisor</p>
        </div>
      </div>

      <div class="glass-panel table-wrapper">
        <div class="panel-header">
           <h3>Log History</h3>
        </div>
        <table class="premium-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Feb 1, 2026</td>
              <td>Frontend Development Task</td>
              <td>8.0</td>
              <td><span class="badge success">Approved</span></td>
            </tr>
            <tr>
              <td>Jan 31, 2026</td>
              <td>API Integration</td>
              <td>8.0</td>
              <td><span class="badge success">Approved</span></td>
            </tr>
            <tr>
              <td>Jan 30, 2026</td>
              <td>System Design Meeting</td>
              <td>4.0</td>
              <td><span class="badge success">Approved</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      padding: 1.5rem;
      text-align: center;
    }

    .stat-card h3 { color: var(--text-muted); font-size: 1rem; margin-bottom: 0.5rem; }
    .value { font-size: 2.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 1rem; }
    .sub-text { font-size: 0.9rem; color: var(--text-muted); }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: var(--primary);
    }

    .table-wrapper { padding: 1.5rem; }
    .panel-header { margin-bottom: 1rem; }
    
    .premium-table { width: 100%; text-align: left; border-collapse: collapse; }
    .premium-table th { padding: 10px; color: var(--text-muted); font-weight: 600; }
    .premium-table td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    
    .badge.success { color: #00c851; background: rgba(0, 200, 81, 0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
  `]
})
export class HoursCheckComponent { }
