import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService, InternshipRequest } from '../../internship/services/internship';
import { environment } from '../../../../environments/environment.development';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
    selector: 'app-request-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmPopupModule],
    templateUrl: './request-detail.component.html',
    styleUrls: ['./request-detail.component.css'],
    providers: [ConfirmationService]
})
export class RequestDetailComponent implements OnInit {
    request: InternshipRequest | null = null;
    showRejectModal = false;
    rejectReason = '';
    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private internshipService: InternshipService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadRequest(+id);
        }
    }

    loadRequest(id: number): void {
        this.internshipService.getRequest(id).subscribe({
            next: (data) => this.request = data,
            error: (err) => console.error('Failed to load request', err)
        });
    }

    getPhotoUrl(path: string): string {
        return `${environment.apiUrl.replace('/api', '')}/storage/${path}`;
    }

    getStatusLabel(status?: string): string {
        switch (status) {
            case 'officer_approved': return 'อนุมัติแล้ว (รอคณบดี)';
            case 'dean_approved': return 'อนุมัติเรียบร้อย';
            case 'rejected': return 'ถูกปฏิเสธ';
            default: return 'รอตรวจสอบ';
        }
    }

    approve(event: Event): void {
        if (!this.request?.id) return;

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'ยืนยันให้อนุมัติคำขอนี้?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.internshipService.approveByOfficer(this.request!.id!).subscribe({
                    next: (res) => {
                        this.loadRequest(this.request!.id!);
                        this.isLoading = false;
                    },
                    error: (err) => {
                        alert('เกิดข้อผิดพลาด: ' + (err.error?.message || 'Server error'));
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    openRejectModal(): void {
        this.showRejectModal = true;
        this.rejectReason = '';
    }

    confirmReject(): void {
        if (!this.request?.id || !this.rejectReason.trim()) {
            alert('กรุณาระบุเหตุผล');
            return;
        }

        this.isLoading = true;
        this.internshipService.rejectRequest(this.request.id, this.rejectReason).subscribe({
            next: (res) => {
                alert('ปฏิเสธคำขอเรียบร้อยแล้ว');
                this.showRejectModal = false;
                this.loadRequest(this.request!.id!);
                this.isLoading = false;
            },
            error: (err) => {
                alert('เกิดข้อผิดพลาด: ' + (err.error?.message || 'Server error'));
                this.isLoading = false;
            }
        });
    }

    downloadPdf(): void {
        if (!this.request?.id) return;

        this.internshipService.downloadPdf(this.request.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `internship_approval_${this.request!.intern_id}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                alert('ไม่สามารถดาวน์โหลดเอกสารได้');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/officer/requests']);
    }
}
