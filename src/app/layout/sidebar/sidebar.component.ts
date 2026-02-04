import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  title: string;
  icon?: string;
  children?: { title: string; link: string; icon?: string }[];
  isOpen?: boolean;
  link?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule],
  template: `
    <aside class="sidebar" [class.collapsed]="!visible">
        <div class="logo-section">
            <h2 *ngIf="visible">Intern CMRU</h2>
            <i *ngIf="!visible" class="pi pi-graduation-cap"></i>
        </div>

        <nav class="sidebar-nav">
            <ul *ngIf="isStudent">
            <li *ngFor="let item of menuItems">
                <!-- Parent Menu Item -->
                <div class="menu-item-header" [class.active]="item.isOpen" (click)="toggleMenu(item)" pRipple>
                    <span class="menu-title" *ngIf="visible">{{ item.title }}</span>
                    <span class="chevron" [class.rotate]="item.isOpen" *ngIf="visible">▼</span>
                </div>

                <!-- Children (Submenu) -->
                <ul class="submenu" [class.expanded]="item.isOpen && visible">
                    <li *ngFor="let child of item.children">
                        <a [routerLink]="child.link" routerLinkActive="active-link" class="submenu-link" pRipple [title]="child.title">
                            <span *ngIf="child.icon" class="icon">{{ child.icon }}</span>
                            <span *ngIf="visible">{{ child.title }}</span>
                        </a>
                    </li>
                </ul>
            </li>
            </ul>
        </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--bg-card);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
      transition: width 0.3s ease;
      position: relative;
      height: 100%;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .logo-section {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      border-bottom: 1px solid var(--border-color);
      background: rgba(59, 130, 246, 0.1); 
      transition: padding 0.3s ease;
    }

    .sidebar.collapsed .logo-section {
      padding: 0 12px;
    }

    .logo-section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-light);
      margin: 0;
      white-space: nowrap;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -1px;
    }

    .logo-section i {
      font-size: 1.5rem;
      color: var(--primary-light);
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 16px 8px;
    }

    .sidebar-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s ease;
      background: transparent;
      color: var(--text-muted);
    }

    .sidebar.collapsed .menu-item-header {
      justify-content: center;
      padding: 12px 8px;
    }

    .menu-item-header:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
    }

    .menu-item-header.active {
      background: rgba(59, 130, 246, 0.15);
      color: var(--primary-light);
      border: 1px solid rgba(59, 130, 246, 0.1);
    }

    .menu-title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .chevron {
      font-size: 0.7rem;
      opacity: 0.6;
      transition: transform 0.3s ease;
    }

    .chevron.rotate {
      transform: rotate(180deg);
    }

    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease;
      margin-left: 8px;
      border-left: 1px solid var(--border-color);
    }

    .submenu.expanded {
      max-height: 500px;
    }

    .sidebar.collapsed .submenu {
      display: none;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      border-radius: 8px;
    }

    .submenu-link:hover {
      color: var(--primary-light);
      background-color: rgba(255,255,255,0.03);
    }

    .submenu-link.active-link {
      color: var(--primary-light);
      font-weight: 500;
      background-color: rgba(59, 130, 246, 0.1);
      border-right: 2px solid var(--primary);
    }

    .icon {
      font-size: 1rem;
    }

    /* Scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 1000;
        background: var(--bg-card);
      }
      
      .sidebar.collapsed {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() visible: boolean = true;
  @Output() visibleChange = new EventEmitter<boolean>();

  isStudent: boolean = false;

  menuItems: MenuItem[] = [
    {
      title: 'เตรียมฝึกประสบการณ์วิชาชีพฯ',
      isOpen: true,
      children: [
        { title: 'ดาวโหลดแบบฟอร์ม', link: '/internship/forms', icon: '📄' },
        { title: 'รายชื่อสถานประกอบการ', link: '/internship/establishments', icon: '🏢' },
        { title: 'ส่งขออนุมัติสถานที่ฝึกงาน', link: '/internship/requests', icon: '📝' },
        { title: 'ประกาศผลการพิจารณา', link: '/internship/results', icon: '📢' }
      ]
    },
    {
      title: 'การฝึกประสบการณ์วิชาชีพ',
      children: [
        { title: 'ส่งหลักฐานตรวจสอบเกณฑ์', link: '/training/criteria', icon: '✅' },
        { title: 'ส่งหลักฐานชั่วโมงฝึก', link: '/training/evidence', icon: '⏱️' },
        { title: 'ปัจฉิมนิเทศนักศึกษา', link: '/training/orientation', icon: '🎓' },
        { title: 'ส่งไฟล์รายงาน', link: '/training/report', icon: '📊' }
      ]
    }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isStudent = user?.role === 'student';
    });
  }

  toggleMenu(item: MenuItem) {
    item.isOpen = !item.isOpen;
  }
}
