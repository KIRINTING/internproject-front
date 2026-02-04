import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ConfirmPopupModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmpopup></p-confirmpopup>
    <header class="navbar glass-panel">
      <div class="nav-left">
          <div class="nav-brand">
            <i class="pi pi-code brand-icon"></i>
            <h1>INTERN <span class="highlight">CMRU</span></h1>
          </div>
      </div>

      <nav class="nav-links">
        <ng-container *ngIf="(currentUser$ | async)?.role === 'student'">
            <a routerLink="/dashboard" routerLinkActive="active">หน้าหลัก</a>
            <a routerLink="/training/criteria" routerLinkActive="active">ตรวจสอบเกณฑ์</a>
            <a routerLink="/training/hours" routerLinkActive="active">บันทึกชั่วโมงฝึกงาน</a>
            <a routerLink="/student-info" routerLinkActive="active">ข้อมูลของนักศึกษา</a>
            <a routerLink="/contact" routerLinkActive="active">ติดต่อเจ้าหน้าที่</a>
        </ng-container>

        <ng-container *ngIf="(currentUser$ | async)?.role === 'mentor'">
            <a routerLink="/mentor/dashboard" routerLinkActive="active">Dashboard</a>
        </ng-container>
        <ng-container *ngIf="(currentUser$ | async)?.role === 'supervisor'">
            <a routerLink="/supervisor/dashboard" routerLinkActive="active">Dashboard</a>
        </ng-container>
        <ng-container *ngIf="(currentUser$ | async)?.role === 'officer'">
            <a routerLink="/officer/dashboard" routerLinkActive="active">Dashboard</a>
        </ng-container>
      </nav>

      <div class="nav-user">
        <div class="user-info">
          <span class="user-name">{{ (currentUser$ | async)?.name }}</span>
          <span class="user-role">{{ (currentUser$ | async)?.role | titlecase }}</span>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="logout($event)">Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem;
      margin-bottom: 20px;
      height: 70px;
      border: 1px solid var(--border-color);
      /* Background handled by glass-panel now */
    }
    
    .nav-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      font-size: 1.5rem;
      color: var(--primary-light);
    }

    .nav-brand h1 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--text-main);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -1px;
      font-weight: 700;
    }

    .highlight {
      color: var(--primary-light);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    @media (max-width: 768px) {
        .nav-links { display: none; }
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-links a:hover {
      color: var(--primary-light);
      text-shadow: 0 0 8px var(--primary-glow);
    }

    .nav-links a.active {
      color: var(--primary-light);
      font-weight: 600;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary-light);
        box-shadow: 0 0 10px var(--primary);
        border-radius: 2px;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-main);
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .btn-sm {
      padding: 6px 16px;
      font-size: 0.85rem;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-sm:hover {
      color: var(--danger);
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
    }
    
    .menu-btn {
        color: var(--text-muted) !important;
    }
  `]
})
export class NavbarComponent {
  currentUser$;

  constructor(
    public authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
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
      }
    });
  }
}
