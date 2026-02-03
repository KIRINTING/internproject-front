import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-container">
      <app-navbar (toggleSidebar)="sidebarVisible = !sidebarVisible"></app-navbar>
      <div class="layout-content">
        <app-sidebar [(visible)]="sidebarVisible"></app-sidebar>
        <main class="main-content glass-panel">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
      background: var(--bg-main);
      display: flex;
      flex-direction: column;
    }

    .layout-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background: white;
      position: relative;
      margin: 20px;
      margin-left: 0;
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }

    /* Scrollbar Styling */
    .main-content::-webkit-scrollbar {
      width: 8px;
    }

    .main-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .main-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class MainLayoutComponent {
  sidebarVisible = true;
}
