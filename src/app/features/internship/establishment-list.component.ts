import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Company {
  id: number;
  name: string;
  type: string;
  location: string;
  rating: number;
}

@Component({
  selector: 'app-establishment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h2><span class="icon">🏢</span> Previous Establishments</h2>
        <p>List of companies where students have interned before.</p>
      </div>

      <div class="glass-panel table-wrapper">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Rating</th>
              <th style="width: 100px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies">
              <td>
                <div class="company-name">{{ company.name }}</div>
              </td>
              <td><span class="badge">{{ company.type }}</span></td>
              <td>{{ company.location }}</td>
              <td>
                <span class="star">⭐</span> {{ company.rating }}
              </td>
              <td>
                <button class="btn btn-sm btn-ghost" (click)="viewDetails(company.id)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .table-wrapper {
      padding: 0;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .premium-table {
      width: 100%;
      border-collapse: collapse;
    }

    .premium-table th {
      text-align: left;
      padding: 1rem 1.5rem;
      background: var(--bg-hover);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border-color);
    }

    .premium-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-main);
    }

    .premium-table tr:last-child td {
        border-bottom: none;
    }

    .premium-table tr:hover td {
      background: var(--primary-light);
    }

    .company-name {
      font-weight: 600;
      color: var(--primary);
    }

    .badge {
      font-size: 0.75rem;
      background: var(--bg-hover);
      padding: 4px 10px;
      border-radius: 20px;
      color: var(--text-muted);
      font-weight: 500;
      border: 1px solid var(--border-color);
    }
    
    .btn-ghost {
        color: var(--primary);
        background: rgba(37, 99, 235, 0.1);
    }
    
    .btn-ghost:hover {
        background: var(--primary);
        color: white;
    }

    .star {
        color: #f59e0b;
    }
  `]
})
export class EstablishmentListComponent {
  companies: Company[] = [
    { id: 1, name: 'Tech Solutions Co., Ltd.', type: 'Software House', location: 'Chiang Mai', rating: 4.5 },
    { id: 2, name: 'Code Masters Agency', type: 'Digital Agency', location: 'Bangkok', rating: 4.8 },
    { id: 3, name: 'Creative Design Studio', type: 'Design', location: 'Chiang Mai', rating: 4.2 },
    { id: 4, name: 'NextGen Systems', type: 'IT Support', location: 'Lamphun', rating: 3.9 }
  ];

  constructor(private router: Router) { }

  viewDetails(id: number) {
    this.router.navigate(['/internship/establishments', id]);
  }
}
