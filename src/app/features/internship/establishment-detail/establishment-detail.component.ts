import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface InternHistory {
    year: string;
    studentName: string;
    major: string;
    rating: number;
}

interface Establishment {
    id: number;
    name: string;
    type: string;
    location: string;
    fullAddress: string;
    rating: number;
    mapUrl: SafeResourceUrl;
    p_history: InternHistory[];
}

@Component({
    selector: 'app-establishment-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-container animate-fade-in">
      <div class="nav-back">
        <a routerLink="/internship/establishments" class="back-link">
          <i class="pi pi-arrow-left"></i> Back to List
        </a>
      </div>

      <div class="header-section" *ngIf="establishment">
        <div class="title-row">
          <h1>{{ establishment.name }}</h1>
          <span class="badge">{{ establishment.type }}</span>
        </div>
        <div class="rating-row">
          <span class="star">⭐</span>
          <span class="rating-val">{{ establishment.rating }}</span>
          <span class="location"><i class="pi pi-map-marker"></i> {{ establishment.location }}</span>
        </div>
      </div>

      <div class="content-grid" *ngIf="establishment">
        <!-- Left Column: Map & Info -->
        <div class="info-column">
           <div class="card glass-panel">
            <h3>Location</h3>
            <p class="address">{{ establishment.fullAddress }}</p>
            <div class="map-wrapper">
              <iframe 
                [src]="establishment.mapUrl" 
                width="100%" 
                height="300" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
            </div>
          </div>
        </div>

        <!-- Right Column: History -->
        <div class="history-column">
          <div class="card glass-panel">
            <h3><span class="icon">📜</span> Internship History</h3>
            <p class="subtitle">Previous students who practiced here.</p>

            <div class="table-responsive">
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Student Name</th>
                    <th>Major</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let history of establishment.p_history">
                    <td><span class="year-badge">{{ history.year }}</span></td>
                    <td>{{ history.studentName }}</td>
                    <td>{{ history.major }}</td>
                    <td>⭐ {{ history.rating }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .nav-back {
      margin-bottom: 1.5rem;
    }

    .back-link {
      color: var(--text-muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--primary);
    }

    .header-section {
      margin-bottom: 2rem;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .title-row h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-main);
    }

    .badge {
      background: var(--bg-hover);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-muted);
    }

    .rating-val {
      font-weight: 700;
      color: var(--text-main);
    }
    
    .location i {
        margin-right: 4px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 24px;
    }

    .card {
      padding: 24px;
      height: 100%;
    }

    .card h3 {
      font-size: 1.25rem;
      margin-bottom: 8px;
      color: var(--text-main);
    }
    
    .subtitle {
        font-size: 0.9rem;
        margin-bottom: 20px;
        color: var(--text-muted);
    }

    .address {
      margin-bottom: 16px;
      color: var(--text-muted);
    }

    .map-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
    }

    .history-table th {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.85rem;
    }

    .history-table td {
      padding: 12px;
      border-bottom: 1px solid var(--bg-hover);
      color: var(--text-main);
      font-size: 0.95rem;
    }
    
    .year-badge {
        background: #f0fdf4;
        color: #15803d;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EstablishmentDetailComponent implements OnInit {
    establishment: Establishment | null = null;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadEstablishment(id);
    }

    loadEstablishment(id: number) {
        // Mock Data based on ID
        // In real app, fetch from API

        // Default location for demo
        const defaultMapBase = 'https://maps.google.com/maps?q=';
        const settings = '&t=&z=15&ie=UTF8&iwloc=&output=embed';

        // Simulate finding data
        const mockData: any = {
            1: {
                name: 'Tech Solutions Co., Ltd.',
                type: 'Software House',
                location: 'Chiang Mai',
                fullAddress: '123 Nimman Road, Suthep, Chiang Mai 50200',
                rating: 4.5,
                latlong: '18.796143,98.979263' // Chiang Mai Mock
            },
            2: {
                name: 'Code Masters Agency',
                type: 'Digital Agency',
                location: 'Bangkok',
                fullAddress: '456 Sukhumvit Road, Watthana, Bangkok 10110',
                rating: 4.8,
                latlong: '13.7563,-459.493' // Bangkok Mock (approx)
            },
            3: {
                name: 'Creative Design Studio',
                type: 'Design',
                location: 'Chiang Mai',
                fullAddress: '789 Old City, Chiang Mai 50000',
                rating: 4.2,
                latlong: '18.7883,98.9853'
            },
            4: {
                name: 'NextGen Systems',
                type: 'IT Support',
                location: 'Lamphun',
                fullAddress: '101 Industrial Estate, Lamphun 51000',
                rating: 3.9,
                latlong: '18.5786,99.0087'
            }
        };

        const data = mockData[id] || mockData[1];

        this.establishment = {
            id: id,
            ...data,
            mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(defaultMapBase + encodeURIComponent(data.fullAddress) + settings),
            p_history: [
                { year: '2567', studentName: 'Somchai Jaidee', major: 'CS', rating: 5 },
                { year: '2566', studentName: 'Somsri Rakrian', major: 'IT', rating: 4 },
                { year: '2566', studentName: 'Mana Meepart', major: 'CS', rating: 4.5 },
            ]
        };
    }
}
