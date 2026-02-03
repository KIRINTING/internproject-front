import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { OfficerService } from '../services/officer.service';

@Component({
    selector: 'app-officer-reports',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule],
    template: `
    <div class="reports-container">
      <div class="header">
        <h1>รายงานสรุปการฝึกงานทั้งหมด</h1>
        <p-button label="Export CSV" icon="pi pi-file-excel" (onClick)="dt.exportCSV()" styleClass="p-button-success"></p-button>
      </div>

      <p-table #dt [value]="reports" [rows]="10" [paginator]="true" 
               [globalFilterFields]="['name', 'student_id', 'company']"
               [rowHover]="true" dataKey="student_id"
               currentPageReportTemplate="แสดง {first} ถึง {last} จาก {totalRecords} รายการ"
               [showCurrentPageReport]="true">
        
        <ng-template pTemplate="header">
            <tr>
                <th pSortableColumn="student_id">รหัสนักศึกษา <p-sortIcon field="student_id"></p-sortIcon></th>
                <th pSortableColumn="name">ชื่อ-นามสกุล <p-sortIcon field="name"></p-sortIcon></th>
                <th pSortableColumn="major">สาขา <p-sortIcon field="major"></p-sortIcon></th>
                <th pSortableColumn="company">สถานประกอบการ <p-sortIcon field="company"></p-sortIcon></th>
                <th pSortableColumn="daily_logs_count">Daily Logs <p-sortIcon field="daily_logs_count"></p-sortIcon></th>
                <th pSortableColumn="mentor_score">คะแนนอาจารย์นิเทศ <p-sortIcon field="mentor_score"></p-sortIcon></th>
                <th pSortableColumn="supervisor_score">คะแนนผู้นิเทศงาน <p-sortIcon field="supervisor_score"></p-sortIcon></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-report>
            <tr>
                <td>{{ report.student_id }}</td>
                <td>{{ report.name }}</td>
                <td>{{ report.major }}</td>
                <td>{{ report.company }}</td>
                <td class="text-center">
                    <p-tag [value]="report.daily_logs_count" severity="info"></p-tag>
                </td>
                <td class="text-center">
                    <span *ngIf="report.mentor_evaluated" class="score-badge success">{{ report.mentor_score }}</span>
                    <span *ngIf="!report.mentor_evaluated" class="text-muted">-</span>
                </td>
                <td class="text-center">
                     <span *ngIf="report.supervisor_evaluated" class="score-badge warning">{{ report.supervisor_score }}</span>
                    <span *ngIf="!report.supervisor_evaluated" class="text-muted">-</span>
                </td>
            </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <tr>
                <td colspan="7">ไม่พบข้อมูล</td>
            </tr>
        </ng-template>
      </p-table>
    </div>
  `,
    styles: [`
    .reports-container {
      padding: 2rem;
      background: #fafafa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
    }

    .score-badge {
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: bold;
        color: white;
    }

    .score-badge.success {
        background-color: #22c55e;
    }

    .score-badge.warning {
        background-color: #f97316;
    }

    .text-center {
        text-align: center;
    }

    .text-muted {
        color: #999;
    }

    ::ng-deep .p-datatable .p-datatable-header {
        background: transparent;
        border: none;
    }
  `]
})
export class ReportsComponent implements OnInit {
    reports: any[] = [];

    constructor(private officerService: OfficerService) { }

    ngOnInit() {
        this.loadReports();
    }

    loadReports() {
        this.officerService.getReports().subscribe({
            next: (data) => {
                this.reports = data;
            },
            error: (error) => {
                console.error('Error loading reports:', error);
            }
        });
    }
}
