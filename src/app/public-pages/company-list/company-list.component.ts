import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompanyService, Company } from '../services/company.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-company-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="page-container">
      <div class="hero-section animate-fade-in">
        <h1 class="page-title"><span class="icon">🏢</span> รายชื่อสถานประกอบการ</h1>
        <p class="page-subtitle">ค้นหาสถานที่ฝึกงานที่น่าสนใจจากเครือข่ายพันธมิตรของเรา</p>
        
        <div class="search-bar glass-panel">
          <span class="search-icon">🔍</span>
          <input type="text" 
                 [(ngModel)]="searchTerm" 
                 (ngModelChange)="onSearch($event)"
                 placeholder="ค้นหาตามชื่อบริษัท, ตำแหน่ง, หรือจังหวัด..." 
                 class="search-input">
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredCompanies.length === 0" class="empty-state animate-fade-in">
        <div class="empty-icon">🏢</div>
        <h3>ไม่พบข้อมูลสถานประกอบการ</h3>
        <p>ลองค้นหาด้วยคำสำคัญอื่น หรือยังไม่มีสถานประกอบการในระบบ</p>
      </div>

      <!-- Company Grid -->
      <div *ngIf="!isLoading && filteredCompanies.length > 0" class="company-grid">
        <div *ngFor="let company of filteredCompanies; let i = index" 
             class="company-card glass-panel animate-slide-up" 
             [style.animation-delay]="i * 0.05 + 's'">
          
          <div class="card-header">
            <div class="company-icon">{{ company.name.charAt(0) }}</div>
            <div class="company-title">
              <h3>{{ company.name }}</h3>
              <span class="position-badge">{{ company.position }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="icon">📍</span>
              <span>{{ company.location }}</span>
            </div>
            <div class="info-row">
              <span class="icon">👥</span>
              <span>รับ {{ company.student_vacancy }} อัตรา</span>
            </div>
            <div class="info-row" *ngIf="company.tel">
              <span class="icon">📞</span>
              <span>{{ company.tel }}</span>
            </div>
          </div>

          <div class="card-footer">
            <a [href]="'tel:' + company.tel" class="btn-contact">ติดต่อสอบถาม</a>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: 80vh;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    /* Glass Effect */
    .glass-panel {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Search Bar */
    .search-bar {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .search-bar:focus-within {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-color: #3b82f6;
    }

    .search-icon {
      font-size: 1.25rem;
      color: #64748b;
    }

    .search-input {
      border: none;
      background: transparent;
      width: 100%;
      font-size: 1rem;
      color: #1e293b;
      outline: none;
    }

    .search-input::placeholder {
      color: #cbd5e1;
    }

    /* Grid Layout */
    .company-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    /* Company Card */
    .company-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.3s ease;
      background: white; /* Fallback */
      background: rgba(255, 255, 255, 0.8);
    }

    .company-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-color: #3b82f6;
    }

    .card-header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .company-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .company-title {
      flex: 1;
    }

    .company-title h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.3;
    }

    .position-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #eff6ff;
      color: #3b82f6;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #64748b;
      font-size: 0.9rem;
    }

    .info-row .icon {
      font-size: 1.1rem;
    }

    .card-footer {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-contact {
      display: block;
      text-align: center;
      width: 100%;
      padding: 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #1e293b;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-contact:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #3b82f6;
    }

    /* Loading & Empty States */
    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: #64748b;
    }

    .spinner {
      margin: 0 auto 1rem;
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: #cbd5e1;
    }

    .empty-state h3 {
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    /* Animations */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }

    .animate-slide-up {
      opacity: 0;
      animation: slideUp 0.6s ease-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .page-title { font-size: 1.75rem; flex-direction: column; gap: 0.5rem; }
      .company-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CompanyListComponent implements OnInit {
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    isLoading = true;
    searchTerm = '';
    private searchSubject = new Subject<string>();

    constructor(private companyService: CompanyService) {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(term => {
            this.filterCompanies(term);
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
    }

    loadCompanies(): void {
        this.isLoading = true;
        this.companyService.getCompanies().subscribe({
            next: (data) => {
                this.companies = data;
                this.filteredCompanies = data;
                this.isLoading = false;
                // Apply initial search if any
                if (this.searchTerm) {
                    this.filterCompanies(this.searchTerm);
                }
            },
            error: (error) => {
                console.error('Error loading companies:', error);
                this.isLoading = false;
            }
        });
    }

    onSearch(term: string): void {
        this.searchSubject.next(term);
    }

    filterCompanies(term: string): void {
        if (!term) {
            this.filteredCompanies = this.companies;
            return;
        }

        const lowerTerm = term.toLowerCase();
        this.filteredCompanies = this.companies.filter(company =>
            company.name.toLowerCase().includes(lowerTerm) ||
            company.position.toLowerCase().includes(lowerTerm) ||
            company.location.toLowerCase().includes(lowerTerm)
        );
    }
}
