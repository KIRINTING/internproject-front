import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-officer-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, RippleModule, ConfirmPopupModule],
    providers: [ConfirmationService],
    templateUrl: './officer-layout.component.html',
    styleUrls: ['./officer-layout.component.css']
})
export class OfficerLayoutComponent {
    pageTitle: string = 'Dashboard';
    sidebarVisible: boolean = true; // Start with sidebar open

    constructor(
        private authService: AuthService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) { }

    onActivate(component: any) {
        // Optional: Dynamically set title based on active component
        if (component.title) {
            this.pageTitle = component.title;
        } else {
            // Default fallback based on URL
            const path = this.router.url.split('/').pop();
            switch (path) {
                case 'dashboard': this.pageTitle = 'ภาพรวมระบบ (Dashboard)'; break;
                case 'requests': this.pageTitle = 'จัดการคำขอฝึกงาน'; break;
                case 'news': this.pageTitle = 'จัดการข่าวสาร'; break;
                case 'reports': this.pageTitle = 'รายงานสรุปผลการฝึกงาน'; break;
                default: this.pageTitle = 'Officer Panel';
            }
        }
    }

    logout(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'ออกจากระบบ',
            rejectLabel: 'ยกเลิก',
            accept: () => {
                this.authService.logout();
                this.router.navigate(['/login']);
            }
        });
    }
}
