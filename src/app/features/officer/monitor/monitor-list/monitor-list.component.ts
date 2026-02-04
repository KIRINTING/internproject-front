import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MonitorService, MonitorSummary } from '../../services/monitor.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-monitor-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ProgressBarModule],
    template: `
    <div class="content-container animate-fade-in">
        <div class="page-header">
            <h1 class="page-title">Monitor Interns</h1>
            <div class="page-subtitle">Track internship progress and evidence.</div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title"><i class="pi pi-users mr-2"></i> Intern List</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Company</th>
                                <th>Progress</th>
                                <th class="text-right">Hours</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let student of interns">
                                <td>
                                    <div class="font-bold">{{ student.full_name }}</div>
                                    <small class="text-muted">{{ student.student_code }}</small>
                                </td>
                                <td>{{ student.company_name }}</td>
                                <td style="width: 30%;">
                                    <div class="progress-wrapper">
                                        <p-progressBar [value]="student.progress_percent" [showValue]="false" 
                                            [style]="{'height': '8px'}" 
                                            [color]="getColor(student.progress_percent)">
                                        </p-progressBar>
                                        <small>{{ student.progress_percent }}%</small>
                                    </div>
                                </td>
                                <td class="text-right">
                                    <span class="font-bold">{{ student.total_hours }}</span> / {{ student.required_hours }}
                                </td>
                                <td class="text-right">
                                    <a [routerLink]="['/officer/monitor', student.id]" class="btn btn-sm btn-primary">
                                        <i class="pi pi-eye"></i> View
                                    </a>
                                </td>
                            </tr>
                            <tr *ngIf="interns.length === 0">
                                <td colspan="5" class="text-center p-4 text-muted">No interns found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 24px; }
    .page-title { font-size: 1.8rem; font-weight: 600; color: #1e293b; margin: 0; }
    .page-subtitle { color: #64748b; margin-top: 4px; }

    .card { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; margin-bottom: 24px; }
    .card-header { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; background: white; }
    .card-title { margin: 0; font-size: 1.1rem; font-weight: 600; color: #334155; display: flex; align-items: center; }
    .card-body.p-0 { padding: 0; }

    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 24px; font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    .font-bold { font-weight: 600; }
    .text-muted { color: #94a3b8; font-size: 0.85rem; }
    .text-right { text-align: right; }
    .mr-2 { margin-right: 0.5rem; }

    .btn { padding: 6px 12px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
    .btn-sm { font-size: 0.85rem; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }

    .progress-wrapper { display: flex; align-items: center; gap: 10px; }
    .progress-wrapper small { min-width: 40px; text-align: right; }
  `]
})
export class MonitorListComponent implements OnInit {
    interns: MonitorSummary[] = [];

    constructor(private monitorService: MonitorService) { }

    ngOnInit() {
        this.monitorService.getMonitorList().subscribe({
            next: (data) => this.interns = data,
            error: (err) => console.error('Failed to load monitor list', err)
        });
    }

    getColor(percent: number): string {
        if (percent < 50) return '#ef4444'; // Red
        if (percent < 80) return '#f59e0b'; // Orange
        return '#10b981'; // Green
    }
}
