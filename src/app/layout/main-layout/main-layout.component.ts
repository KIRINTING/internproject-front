import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="layout-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="layout-footer">
        <p>Copyright &copy; {{ currentYear }} Department of Computer CMRU</p>
      </footer>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
      background: var(--bg-main);
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }

    /* Scrollbar Styling */
    .main-content::-webkit-scrollbar {
      width: 8px;
    }

    .main-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .main-content::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted);
    }

    .layout-footer {
      text-align: center;
      padding: 1rem;
      color: var(--text-muted);
      font-size: 0.875rem;
      border-top: 1px solid var(--border-color);
      background: var(--bg-main);
    }
  `]
})
export class MainLayoutComponent {
  currentYear = new Date().getFullYear();
}
