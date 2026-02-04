import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-officer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <i class="pi pi-shield"></i>
        </div>
        <span class="brand-text">Officer Panel</span>
      </div>

      <div class="sidebar-menu">
        <ul class="menu-list">
          <li class="menu-header">MAIN NAVIGATION</li>
          
          <li class="menu-item">
            <a routerLink="/officer/dashboard" routerLinkActive="active" class="menu-link">
              <i class="pi pi-home"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <li class="menu-item">
            <a routerLink="/officer/monitor" routerLinkActive="active" class="menu-link">
              <i class="pi pi-chart-line"></i>
              <span>Monitor Interns</span>
            </a>
          </li>

          <li class="menu-item">
            <a routerLink="/officer/requests" routerLinkActive="active" class="menu-link">
              <i class="pi pi-file-check"></i>
              <span>Requests</span>
              <span class="badge" *ngIf="pendingCount > 0">{{ pendingCount }}</span>
            </a>
          </li>

          <li class="menu-item">
            <a routerLink="/officer/documents" routerLinkActive="active" class="menu-link">
              <i class="pi pi-folder-open"></i>
              <span>Documents</span>
            </a>
          </li>

          <li class="menu-item">
            <a routerLink="/officer/students" routerLinkActive="active" class="menu-link">
              <i class="pi pi-users"></i>
              <span>Students</span>
            </a>
          </li>

          <li class="menu-item">
            <a routerLink="/officer/news" routerLinkActive="active" class="menu-link">
              <i class="pi pi-megaphone"></i>
              <span>Announcements</span>
            </a>
          </li>



          <li class="menu-header">REPORTS</li>
          
          <li class="menu-item">
            <a routerLink="/officer/reports" routerLinkActive="active" class="menu-link">
              <i class="pi pi-chart-bar"></i>
              <span>Summary</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-info">
            <span class="name">Admin User</span>
            <span class="role">Officer</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1e293b; /* Dark Slate */
      color: #f1f5f9;
      transition: width 0.3s ease;
      width: 250px;
      flex-shrink: 0;
      box-shadow: 4px 0 24px rgba(0,0,0,0.1);
    }

    :host.collapsed {
      width: 70px;
    }

    .sidebar {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Brand Section */
    .sidebar-brand {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      background: #0f172a; /* Darker Slate */
      border-bottom: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
    }

    .brand-logo {
      min-width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      border-radius: 6px;
      margin-right: 12px;
      color: white;
    }

    .brand-text {
      font-weight: 700;
      font-size: 1.1rem;
      color: white;
      letter-spacing: 0.5px;
    }

    /* Menu Section */
    .sidebar-menu {
      flex: 1;
      padding: 16px 0;
      overflow-y: auto;
    }

    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-header {
      padding: 12px 24px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 1px;
      margin-top: 8px;
    }

    .menu-item {
      margin-bottom: 4px;
    }

    .menu-link {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      white-space: nowrap;
    }

    .menu-link:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    .menu-link.active {
      background: rgba(37, 99, 235, 0.1); /* Primary with opacity */
      color: var(--primary-light); /* Assuming lighter primary for dark bg */
      border-left-color: var(--primary);
    }
    
    /* Fallback for primary-light if not defined globally */
    .menu-link.active {
        color: #60a5fa; 
    }

    .menu-link i {
      min-width: 20px; /* consistent spacing even if text hidden */
      margin-right: 12px;
      font-size: 1.1rem;
    }

    .badge {
      margin-left: auto;
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    /* Footer Section */
    .sidebar-footer {
      padding: 16px;
      background: #0f172a;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: #334155;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-info .name {
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
    }

    .user-info .role {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    /* Scrollbar Styling */
    .sidebar-menu::-webkit-scrollbar {
        width: 6px;
    }
    
    .sidebar-menu::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .sidebar-menu::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }
    
    .sidebar-menu::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Collapsed State Overrides */
    :host.collapsed .brand-text,
    :host.collapsed .menu-link span,
    :host.collapsed .menu-header,
    :host.collapsed .badge,
    :host.collapsed .user-info {
      display: none;
    }
    
    :host.collapsed .sidebar-brand,
    :host.collapsed .menu-link {
        justify-content: center;
        padding-left: 0;
        padding-right: 0;
    }
    
    :host.collapsed .menu-link i {
        margin-right: 0;
    }
    
    :host.collapsed .menu-link {
       border-left: none; /* remove border indicator in collapsed mode or keep it? kept nice */
    }
  `]
})
export class OfficerSidebarComponent {
  @Input() collapsed = false;
  @Input() pendingCount = 0; // Receive count from parent
}
