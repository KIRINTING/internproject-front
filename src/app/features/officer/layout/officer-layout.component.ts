import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { OfficerSidebarComponent } from './officer-sidebar/officer-sidebar.component';
import { OfficerTopbarComponent } from './officer-topbar/officer-topbar.component';

@Component({
    selector: 'app-officer-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ConfirmPopupModule,
        OfficerSidebarComponent,
        OfficerTopbarComponent
    ],
    providers: [ConfirmationService],
    template: `
        <div class="admin-wrapper" [class.sidebar-collapsed]="isSidebarCollapsed">
            <p-confirmpopup></p-confirmpopup>

            <!-- Sidebar -->
            <app-officer-sidebar 
                [collapsed]="isSidebarCollapsed" 
                [pendingCount]="pendingCount">
            </app-officer-sidebar>

            <div class="main-content">
                <!-- Topbar -->
                <app-officer-topbar 
                    (toggle)="toggleSidebar()" 
                    (logout)="logout()">
                </app-officer-topbar>

                <!-- Page Content -->
                <div class="content-body">
                    <router-outlet (activate)="onActivate($event)"></router-outlet>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./officer-layout.component.css']
})
export class OfficerLayoutComponent {
    isSidebarCollapsed = false;
    pendingCount = 0; // Can be updated via a shared service later

    constructor(
        private authService: AuthService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) { }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    onActivate(component: any) {
        // Logic to update breadcrumbs or titles if needed
    }

    logout() {
        this.confirmationService.confirm({
            target: event?.target as EventTarget,
            message: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'ออกจากระบบ',
            rejectLabel: 'ยกเลิก',
            accept: () => {
                this.authService.logout();
                this.router.navigate(['/']);
            }
        });
    }
}
