import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MonitorService, MonitorDetail } from '../../services/monitor.service';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-monitor-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ImageModule, PaginatorModule],
    template: `
    <div class="content-container animate-fade-in" *ngIf="data">
        <div class="page-header custom-header">
            <div>
                <button routerLink="/officer/monitor" class="back-link">
                    <i class="pi pi-arrow-left"></i> Back to List
                </button>
                <div class="student-profile">
                    <h1 class="student-name">{{ data.intern.full_name }}</h1>
                    <div class="student-meta">
                        <span><i class="pi pi-id-card"></i> {{ data.intern.student_code }}</span>
                        <span><i class="pi pi-building"></i> {{ data.intern.company_name }}</span>
                        <span><i class="pi pi-briefcase"></i> {{ data.intern.position }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hours Summary Widget -->
        <div class="stats-row">
            <div class="stat-box">
                <div class="stat-label">Weekday Hours</div>
                <div class="stat-value text-blue">{{ data.hours.weekday }}</div>
                <div class="stat-desc">Normal working days</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Weekend Hours</div>
                <div class="stat-value text-orange">{{ data.hours.weekend }}</div>
                <div class="stat-desc">Overtime / Holidays</div>
            </div>
            <div class="stat-box highlight">
                <div class="stat-label">Total Hours</div>
                <div class="stat-value text-green">{{ data.hours.total }}</div>
                <div class="stat-desc">Combined duration</div>
            </div>
        </div>
        
        <!-- Detailed Stats Row -->
        <div class="stats-row secondary-stats">
            <div class="stat-box">
                <div class="stat-label">Days Worked</div>
                <div class="stat-value">{{ data.hours.days_worked }}</div>
                <div class="stat-desc">Total active days</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Absence</div>
                <div class="stat-value text-red">{{ data.hours.days_absence }}</div>
                <div class="stat-desc">Days absent</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Leave</div>
                <div class="stat-value text-orange">{{ data.hours.days_leave }}</div>
                <div class="stat-desc">Personal/Sick leave</div>
            </div>
        </div>

        <!-- Latest Photo Section -->
        <div class="card mb-4" *ngIf="data.photos.length > 0">
            <div class="card-header">
                <h3 class="card-title"><i class="pi pi-camera mr-2"></i> Latest Work Evidence</h3>
            </div>
            <div class="card-body">
                <div class="latest-photo-container">
                    <div class="latest-photo-wrapper">
                         <p-image 
                            [src]="data.photos[0].url" 
                            [alt]="data.photos[0].description" 
                            width="100%" 
                            [preview]="true">
                        </p-image>
                    </div>
                    <div class="latest-photo-info">
                        <h4>{{ data.photos[0].date | date:'EEEE, dd MMMM yyyy' }}</h4>
                        <p>{{ data.photos[0].description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Daily Log List -->
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="card-title"><i class="pi pi-list mr-2"></i> Daily Log History</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Description</th>
                                <th>Evidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let log of data.logs.slice(first, first + rows)">
                                <td style="width: 15%;">
                                    <div class="log-date">{{ log.date | date:'dd MMM yyyy' }}</div>
                                    <span class="badge" [class.weekend]="log.is_weekend" *ngIf="log.is_weekend">Weekend</span>
                                </td>
                                <td style="width: 10%;">
                                    <span class="font-bold">{{ log.hours }} hrs</span>
                                </td>
                                <td>
                                    <p class="log-desc">{{ log.desc }}</p>
                                </td>
                                <td style="width: 10%;">
                                    <p-image *ngIf="log.photo" [src]="log.photo" alt="Evidence" width="50" preview="true"></p-image>
                                </td>
                            </tr>
                            <tr *ngIf="!data.logs || data.logs.length === 0">
                                <td colspan="4" class="text-center p-4 text-muted">No logs recorded.</td>
                            </tr>
                        </tbody>
                    </table>
                    <p-paginator 
                        *ngIf="data.logs && data.logs.length > 0"
                        [first]="first" 
                        [rows]="rows" 
                        [totalRecords]="data.logs.length" 
                        (onPageChange)="onPageChange($event)"
                        [rowsPerPageOptions]="[5, 10, 20]"
                        styleClass="custom-paginator">
                    </p-paginator>
                </div>
            </div>
        </div>

        <!-- Photo Gallery -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title"><i class="pi pi-images mr-2"></i> Work Evidence Gallery</h3>
            </div>
            <div class="card-body">
                <div class="gallery-grid">
                    <div class="gallery-item" *ngFor="let photo of data.photos">
                        <p-image 
                            [src]="photo.url" 
                            [alt]="photo.description" 
                            width="100%" 
                            [preview]="true">
                        </p-image>
                        <div class="photo-caption">
                            <div class="photo-date">{{ photo.date | date:'dd MMM yyyy' }}</div>
                            <div class="photo-desc" [title]="photo.description">{{ photo.description }}</div>
                        </div>
                    </div>
                    <div class="empty-state" *ngIf="data.photos.length === 0">
                        <i class="pi pi-image"></i>
                        <p>No photos uploaded yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 24px; }
    .back-link { background: none; border: none; color: #64748b; font-size: 0.9rem; margin-bottom: 12px; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 6px; }
    .back-link:hover { color: #3b82f6; }
    
    .student-name { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
    .student-meta { display: flex; gap: 20px; color: #64748b; font-size: 0.95rem; }
    .student-meta span { display: flex; align-items: center; gap: 6px; }

    /* Stats Row */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .stat-box { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center; }
    .stat-box.highlight { border-color: #10b981; background: #f0fdf4; }
    .stat-label { font-size: 0.9rem; color: #64748b; font-weight: 500; margin-bottom: 8px; }
    .stat-value { font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .text-blue { color: #3b82f6; }
    .text-orange { color: #f59e0b; }
    .text-green { color: #10b981; }
    .stat-desc { font-size: 0.8rem; color: #94a3b8; }

    /* Gallery */
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .card-header { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
    .card-title { margin: 0; font-size: 1.1rem; font-weight: 600; color: #334155; display: flex; align-items: center; }
    .card-body { padding: 24px; }
    
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .gallery-item { border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; transition: transform 0.2s; background: white; }
    .gallery-item:hover { transform: translateY(-4px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    
    /* PrimeNG Image override adjustments if needed, scoped here */
    ::ng-deep .p-image img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
    }

    .photo-caption { padding: 12px; }
    .photo-date { font-size: 0.75rem; color: #94a3b8; margin-bottom: 4px; }
    .photo-desc { font-size: 0.85rem; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8; }
    .empty-state i { font-size: 3rem; margin-bottom: 12px; opacity: 0.5; }

    .text-red { color: #ef4444; }
    .mb-4 { margin-bottom: 24px; }
    
    .latest-photo-container { display: flex; gap: 24px; align-items: flex-start; }
    .latest-photo-wrapper { flex: 0 0 300px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .latest-photo-info { flex: 1; }
    .latest-photo-info h4 { margin: 0 0 8px 0; color: #1e293b; }
    .latest-photo-info p { color: #475569; line-height: 1.6; }
    
    /* Log List Styles */
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 24px; font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
    .log-date { font-weight: 600; color: #1e293b; margin-bottom: 4px; }
    .log-desc { margin: 0; color: #475569; line-height: 1.5; font-size: 0.95rem; }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; background: #e2e8f0; color: #64748b; }
    .badge.weekend { background: #fee2e2; color: #ef4444; }
    .table-responsive { overflow-x: auto; }

    ::ng-deep .custom-paginator {
        background: transparent !important;
        border-top: 1px solid #e2e8f0 !important;
    }

    @media (max-width: 768px) {
        .latest-photo-container { flex-direction: column; }
        .latest-photo-wrapper { flex: 0 0 auto; width: 100%; }
        .stats-row { grid-template-columns: 1fr; }
    }
  `]
})
export class MonitorDetailComponent implements OnInit {
    data: MonitorDetail | null = null;

    // Pagination
    first = 0;
    rows = 5;

    constructor(
        private route: ActivatedRoute,
        private monitorService: MonitorService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.monitorService.getMonitorDetail(+id).subscribe({
                next: (res) => this.data = res,
                error: (err) => console.error(err)
            });
        }
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
}
