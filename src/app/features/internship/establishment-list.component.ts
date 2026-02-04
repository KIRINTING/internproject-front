import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Company, CompanyService } from './services/company.service';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-establishment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container animate-fade-in">
      <p-toast></p-toast>
      <div class="page-header">
        <div class="header-content">
          <div>
            <h2><span class="icon">🏢</span> Establishments</h2>
            <p>List of companies where students have interned before.</p>
          </div>
          <button pButton label="Add Company" icon="pi pi-plus" class="p-button-primary" (click)="showAddDialog()"></button>
        </div>
      </div>

      <div class="glass-panel table-wrapper">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Vacancy</th>
              <th style="width: 100px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies">
              <td>
                <div class="company-name">{{ company.name }}</div>
                <div class="text-xs text-muted">{{ company.company_id }}</div>
              </td>
              <td><span class="badge">{{ company.position }}</span></td> <!-- position used as type -->
              <td>{{ company.location }}</td>
              <td>{{ company.tel }}</td>
              <td>
                 <span class="badge vacancy-badge" [ngClass]="{'available': company.student_vacancy > 0}">
                    {{ company.student_vacancy }} spots
                 </span>
              </td>
              <td>
                <button class="btn btn-sm btn-ghost" (click)="viewDetails(company.id!)">View</button>
              </td>
            </tr>
            <tr *ngIf="companies.length === 0">
              <td colspan="6" class="text-center p-4">No establishments found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Company Dialog -->
      <p-dialog header="Add Establishment" [(visible)]="displayAddDialog" [modal]="true" [style]="{width: '500px'}" [draggable]="false" [resizable]="false">
        <div class="form-grid">
          <div class="field">
            <label for="company_id">Company ID</label>
            <input type="text" pInputText id="company_id" [(ngModel)]="newCompany.company_id" class="w-full" placeholder="e.g. COMP-001" />
          </div>
          <div class="field">
            <label for="name">Company Name</label>
            <input type="text" pInputText id="name" [(ngModel)]="newCompany.name" class="w-full" placeholder="Company Name" />
          </div>
          <div class="field">
            <label for="type">Type / Industry</label>
            <input type="text" pInputText id="type" [(ngModel)]="newCompany.position" class="w-full" placeholder="e.g. Software House" />
          </div>
          <div class="field">
            <label for="location">Location (City/Province)</label>
            <input type="text" pInputText id="location" [(ngModel)]="newCompany.location" class="w-full" placeholder="e.g. Bangkok" />
          </div>
          <div class="field">
            <label for="tel">Telephone</label>
            <input type="text" pInputText id="tel" [(ngModel)]="newCompany.tel" class="w-full" placeholder="Contact Number" />
          </div>
          <div class="field">
            <label for="vacancy">Student Vacancy</label>
            <p-inputNumber id="vacancy" [(ngModel)]="newCompany.student_vacancy" [min]="0" styleClass="w-full"></p-inputNumber>
          </div>
          <div class="field full-width">
            <label for="address_details">Address Details</label>
            <textarea pInputTextarea id="address_details" [(ngModel)]="newCompany.address_details" rows="3" class="w-full" placeholder="Full address information..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button pButton label="Cancel" class="p-button-text" (click)="displayAddDialog = false"></button>
          <button pButton label="Save" class="p-button-primary" (click)="saveCompany()" [disabled]="!isValid()"></button>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .table-wrapper {
      padding: 0;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: white;
    }

    .premium-table {
      width: 100%;
      border-collapse: collapse;
    }

    .premium-table th {
      text-align: left;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      color: var(--text-muted, #64748b);
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .premium-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
      color: var(--text-main, #334155);
    }

    .premium-table tr:last-child td {
        border-bottom: none;
    }

    .premium-table tr:hover td {
      background: #f1f5f9;
    }

    .company-name {
      font-weight: 600;
      color: var(--primary, #2563eb);
    }

    .badge {
      font-size: 0.75rem;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 20px;
      color: #64748b;
      font-weight: 500;
      border: 1px solid #e2e8f0;
    }
    
    .vacancy-badge {
      background: #fee2e2;
      color: #991b1b;
      border-color: #fecaca;
    }
    
    .vacancy-badge.available {
      background: #dcfce7;
      color: #166534;
      border-color: #bbf7d0;
    }
    
    .btn-ghost {
        color: var(--primary, #2563eb);
        background: rgba(37, 99, 235, 0.1);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-ghost:hover {
        background: var(--primary, #2563eb);
        color: white;
    }

    .text-xs { font-size: 0.75rem; }
    .text-muted { color: #94a3b8; }
    .text-center { text-align: center; }
    .p-4 { padding: 1rem; }
    .w-full { width: 100%; }
    .mt-4 { margin-top: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .flex { display: flex; }
    .justify-end { justify-content: flex-end; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .field label {
      font-weight: 500;
      font-size: 0.9rem;
      color: #475569;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
  `]
})
export class EstablishmentListComponent implements OnInit {
  companies: Company[] = [];
  displayAddDialog: boolean = false;

  newCompany: Company = this.getEmptyCompany();

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Failed to load companies', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load establishments' });
      }
    });
  }

  showAddDialog() {
    this.newCompany = this.getEmptyCompany();
    this.displayAddDialog = true;
  }

  getEmptyCompany(): Company {
    return {
      company_id: '',
      name: '',
      position: '',
      location: '',
      tel: '',
      address_details: '',
      student_vacancy: 0
    };
  }

  isValid(): boolean {
    return !!(
      this.newCompany.company_id &&
      this.newCompany.name &&
      this.newCompany.position &&
      this.newCompany.location &&
      this.newCompany.tel
    );
  }

  saveCompany() {
    if (!this.isValid()) return;

    this.companyService.createCompany(this.newCompany).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company added successfully' });
        this.displayAddDialog = false;
        this.loadCompanies();
      },
      error: (err) => {
        console.error('Failed to create company', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add company' });
      }
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/internship/establishments', id]);
  }
}
