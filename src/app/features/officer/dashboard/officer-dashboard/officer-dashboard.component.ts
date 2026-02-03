import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InternshipService, InternshipRequest } from '../../../internship/services/internship';

@Component({
    selector: 'app-officer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './officer-dashboard.component.html',
    styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {
    recentRequests: InternshipRequest[] = [];
    stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
    };

    constructor(private internshipService: InternshipService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.internshipService.getRequests().subscribe({
            next: (data) => {
                this.stats.total = data.length;
                this.stats.pending = data.filter(r => !r.status || r.status === 'pending').length;
                this.stats.approved = data.filter(r => r.status === 'officer_approved' || r.status === 'dean_approved').length;
                this.stats.rejected = data.filter(r => r.status === 'rejected').length;

                // Get 5 most recent
                this.recentRequests = data
                    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                    .slice(0, 5);
            },
            error: (err) => console.error('Failed to load dashboard data', err)
        });
    }

    getStatusIcon(status?: string): string {
        switch (status) {
            case 'officer_approved': return 'pi-check';
            case 'dean_approved': return 'pi-check-circle';
            case 'rejected': return 'pi-times';
            default: return 'pi-clock';
        }
    }

    getStatusLabel(status?: string): string {
        switch (status) {
            case 'officer_approved': return 'อนุมัติแล้ว';
            case 'dean_approved': return 'อนุมัติเรียบร้อย';
            case 'rejected': return 'ถูกปฏิเสธ';
            default: return 'รอตรวจสอบ';
        }
    }
}
