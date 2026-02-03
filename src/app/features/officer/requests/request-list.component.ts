import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InternshipService, InternshipRequest } from '../../internship/services/internship';

@Component({
    selector: 'app-request-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
    title = 'จัดการคำขอฝึกงาน';
    requests: InternshipRequest[] = [];
    filteredRequests: InternshipRequest[] = [];
    filterStatus: string = 'all';
    searchTerm: string = '';

    constructor(
        private internshipService: InternshipService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.internshipService.getRequests().subscribe({
            next: (data) => {
                this.requests = data;
                this.applyFilters();
            },
            error: (err) => console.error('Failed to load requests', err)
        });
    }

    setFilter(status: string): void {
        this.filterStatus = status;
        this.applyFilters();
    }

    onSearch(event: any): void {
        this.searchTerm = event.target.value.toLowerCase();
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredRequests = this.requests.filter(req => {
            // 1. Filter by Status
            let statusMatch = true;
            if (this.filterStatus !== 'all') {
                const status = req.status || 'pending';
                statusMatch = status === this.filterStatus;
            }

            // 2. Filter by Search Term
            let searchMatch = true;
            if (this.searchTerm) {
                const fullName = `${req.title}${req.first_name} ${req.last_name}`.toLowerCase();
                const studentCode = req.student_code.toLowerCase();
                searchMatch = fullName.includes(this.searchTerm) || studentCode.includes(this.searchTerm);
            }

            return statusMatch && searchMatch;
        });
    }

    getStatusLabel(status?: string): string {
        switch (status) {
            case 'officer_approved': return 'อนุมัติแล้ว (รอคณบดี)';
            case 'dean_approved': return 'อนุมัติเรียบร้อย';
            case 'rejected': return 'ถูกปฏิเสธ';
            default: return 'รอตรวจสอบ';
        }
    }

    viewDetail(id: number): void {
        this.router.navigate(['/officer/requests', id]);
    }
}
