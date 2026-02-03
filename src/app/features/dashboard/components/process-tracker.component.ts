import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProcessStage {
  id: number;
  title: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'pending';
  route?: string;
}

@Component({
  selector: 'app-process-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="process-tracker-container">
      <div class="tracker-header">
        <h3>📊 การติดตามความคืบหน้า</h3>
        <div class="progress-info">
          <span class="progress-text">ความคืบหน้าโดยรวม: {{ overallProgress }}%</span>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="overallProgress"></div>
        </div>
      </div>

      <div class="stages-container">
        <div 
          *ngFor="let stage of stages; let i = index; let last = last"
          class="stage-wrapper">
          
          <div 
            class="stage-item"
            [class.completed]="stage.status === 'completed'"
            [class.in-progress]="stage.status === 'in-progress'"
            [class.pending]="stage.status === 'pending'"
            (click)="onStageClick(stage)">
            
            <div class="stage-icon">
              <span class="icon-text">{{ stage.icon }}</span>
              <div class="status-indicator" *ngIf="stage.status === 'completed'">✓</div>
              <div class="status-indicator pulse" *ngIf="stage.status === 'in-progress'">⏳</div>
            </div>
            
            <div class="stage-info">
              <div class="stage-number">ขั้นตอนที่ {{ stage.id }}</div>
              <div class="stage-title">{{ stage.title }}</div>
            </div>
          </div>

          <div class="connector" *ngIf="!last" [class.completed]="stages[i + 1]?.status === 'completed'"></div>
        </div>
      </div>

      <div class="tracker-footer">
        <div class="status-legend">
          <div class="legend-item">
            <span class="legend-dot completed"></span>
            <span>เสร็จสิ้น</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot in-progress"></span>
            <span>กำลังดำเนินการ</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot pending"></span>
            <span>รอดำเนินการ</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .process-tracker-container {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 2rem;
    }

    .tracker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .tracker-header h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-text {
      font-size: 1rem;
      font-weight: 600;
      color: #4285f4;
    }

    .progress-bar-container {
      margin-bottom: 2rem;
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      background: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4285f4 0%, #34a853 100%);
      border-radius: 6px;
      transition: width 0.6s ease;
    }

    .stages-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      position: relative;
    }

    .stage-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .stage-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: transform 0.3s ease;
      flex: 1;
    }

    .stage-item:hover {
      transform: translateY(-5px);
    }

    .stage-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      position: relative;
      transition: all 0.3s ease;
      border: 4px solid #e0e0e0;
      background: white;
    }

    .stage-item.completed .stage-icon {
      border-color: #00c851;
      background: linear-gradient(135deg, #00c851 0%, #007e33 100%);
      box-shadow: 0 4px 15px rgba(0, 200, 81, 0.3);
    }

    .stage-item.in-progress .stage-icon {
      border-color: #4285f4;
      background: linear-gradient(135deg, #4285f4 0%, #1967d2 100%);
      box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
      animation: pulse-ring 2s infinite;
    }

    .stage-item.pending .stage-icon {
      border-color: #ccc;
      background: #f5f5f5;
    }

    .icon-text {
      filter: grayscale(100%);
    }

    .stage-item.completed .icon-text,
    .stage-item.in-progress .icon-text {
      filter: grayscale(0%) brightness(1.2);
    }

    .status-indicator {
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .status-indicator.pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes pulse-ring {
      0% {
        box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
      }
    }

    .stage-info {
      text-align: center;
    }

    .stage-number {
      font-size: 0.75rem;
      color: #999;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }

    .stage-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
    }

    .stage-item.completed .stage-title {
      color: #00c851;
    }

    .stage-item.in-progress .stage-title {
      color: #4285f4;
    }

    .connector {
      flex: 1;
      height: 4px;
      background: #e0e0e0;
      margin: 0 1rem;
      margin-top: 40px;
      border-radius: 2px;
      position: relative;
    }

    .connector.completed {
      background: linear-gradient(90deg, #00c851 0%, #4285f4 100%);
    }

    .tracker-footer {
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .status-legend {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .legend-dot.completed {
      background: #00c851;
    }

    .legend-dot.in-progress {
      background: #4285f4;
    }

    .legend-dot.pending {
      background: #ccc;
    }

    /* Responsive */
    @media (max-width: 968px) {
      .stages-container {
        flex-direction: column;
        gap: 1.5rem;
      }

      .stage-wrapper {
        width: 100%;
      }

      .stage-item {
        flex-direction: row;
        justify-content: flex-start;
        text-align: left;
      }

      .stage-info {
        text-align: left;
      }

      .connector {
        display: none;
      }

      .stage-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProcessTrackerComponent {
  @Input() set internshipStatus(status: string | null) {
    if (status) {
      this.updateStagesBasedOnStatus(status);
    }
  }

  stages: ProcessStage[] = [
    {
      id: 1,
      title: 'เตรียมเอกสาร',
      icon: '📝',
      status: 'completed',
      route: '/internship/forms'
    },
    {
      id: 2,
      title: 'ส่งคำขอ',
      icon: '📤',
      status: 'completed',
      route: '/internship/requests'
    },
    {
      id: 3,
      title: 'รออนุมัติ',
      icon: '✅',
      status: 'in-progress',
      route: '/internship/results'
    },
    {
      id: 4,
      title: 'ฝึกงาน',
      icon: '🎓',
      status: 'pending',
      route: '/training/evidence'
    },
    {
      id: 5,
      title: 'ส่งรายงาน',
      icon: '📊',
      status: 'pending',
      route: '/training/report'
    }
  ];

  constructor(private router: Router) { }

  get overallProgress(): number {
    const completedCount = this.stages.filter(s => s.status === 'completed').length;
    const inProgressCount = this.stages.filter(s => s.status === 'in-progress').length;
    return Math.round(((completedCount + (inProgressCount * 0.5)) / this.stages.length) * 100);
  }

  updateStagesBasedOnStatus(status: string): void {
    // Reset all stages to default first
    this.stages.forEach(stage => {
      if (stage.id <= 2) {
        stage.status = 'completed';
      } else {
        stage.status = 'pending';
      }
    });

    // Update based on internship status
    switch (status) {
      case 'pending':
        // Stage 1-2 completed, Stage 3 in progress
        this.stages[2].status = 'in-progress'; // รออนุมัติ
        break;

      case 'officer_approved':
      case 'dean_approved':
        // Stage 1-3 completed, Stage 4 in progress
        this.stages[2].status = 'completed'; // รออนุมัติ
        this.stages[3].status = 'in-progress'; // ฝึกงาน
        break;

      case 'rejected':
        // Stage 1-2 completed, Stage 3 pending (rejected)
        this.stages[2].status = 'pending'; // รออนุมัติ (show as pending/rejected)
        break;

      default:
        // No internship request yet - only stage 1 in progress
        this.stages[0].status = 'in-progress';
        this.stages[1].status = 'pending';
        this.stages[2].status = 'pending';
        break;
    }
  }

  onStageClick(stage: ProcessStage): void {
    if (stage.route && (stage.status === 'completed' || stage.status === 'in-progress')) {
      this.router.navigate([stage.route]);
    }
  }
}

