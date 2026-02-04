import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-officer-topbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i class="pi pi-bars"></i>
        </button>
        <div class="breadcrumb">
          <span class="text-muted">Officer Panel</span>
          <i class="pi pi-chevron-right separator"></i>
          <span class="current">Dashboard</span>
        </div>
      </div>

      <div class="topbar-right">
        <div class="action-icons">
          <button class="icon-btn">
            <i class="pi pi-bell"></i>
            <span class="badge-dot"></span>
          </button>
        </div>
        
        <div class="user-dropdown">
           <button class="logout-btn" (click)="onLogout()">
              <i class="pi pi-power-off"></i>
              <span>Logout</span>
           </button>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .topbar {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 99;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .toggle-btn {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-btn:hover {
      background: #f1f5f9;
      color: var(--primary);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .separator {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .text-muted { color: #64748b; }
    .current { font-weight: 600; color: #334155; }

    /* Right Side */
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 1.1rem;
      cursor: pointer;
      position: relative;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: #f1f5f9;
      color: var(--primary);
    }

    .badge-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid #e2e8f0;
      padding: 8px 16px;
      border-radius: 20px;
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fecaca;
    }
  `]
})
export class OfficerTopbarComponent {
    @Output() toggle = new EventEmitter<void>();
    @Output() logout = new EventEmitter<void>();

    toggleSidebar() {
        this.toggle.emit();
    }

    onLogout() {
        this.logout.emit();
    }
}
