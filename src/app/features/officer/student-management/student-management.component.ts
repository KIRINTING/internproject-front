import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfficerStudentService, Student } from '../services/officer-student.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-student-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DatePickerModule,
        DialogModule,
        ToastModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: `
    <div class="page-container animate-fade-in">
        <p-toast></p-toast>
        <div class="page-header flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
                    <i class="pi pi-users text-primary"></i> 
                    Student Management
                </h2>
                <p class="text-slate-500 m-0 mt-1">Manage student accounts and access duration</p>
            </div>
            <!-- Optional: Add a button here if needed in future (e.g. Export) -->
        </div>

        <div class="content-card card">
            <!-- Toolbar -->
            <div class="flex flex-wrap gap-3 mb-4 justify-between items-center">
                <div class="flex-1 w-full max-w-md">
                    <p-iconfield iconPosition="left" class="w-full">
                        <p-inputicon styleClass="pi pi-search" />
                        <input type="text" pInputText placeholder="Search by name, code, or major..." 
                               class="w-full p-inputtext-sm"
                               [(ngModel)]="searchTerm" (keydown.enter)="loadStudents()" />
                    </p-iconfield>
                </div>
                <div class="flex gap-2">
                    <button pButton label="Search" icon="pi pi-search" (click)="loadStudents()" class="p-button-primary"></button>
                    <button pButton icon="pi pi-refresh" (click)="refresh()" class="p-button-outlined p-button-secondary" pTooltip="Refresh" tooltipPosition="bottom"></button>
                </div>
            </div>

            <!-- Table -->
            <p-table [value]="students" [lazy]="true" (onLazyLoad)="loadStudents($event)" 
                     [totalRecords]="totalRecords" [rows]="10" [paginator]="true" 
                     [showCurrentPageReport]="true"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                     [rowsPerPageOptions]="[10, 25, 50]"
                     [loading]="loading" 
                     styleClass="p-datatable-striped p-datatable-sm p-datatable-gridlines"
                     [tableStyle]="{'min-width': '60rem'}">
                
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 15%">Code</th>
                        <th style="width: 20%">Name (TH)</th>
                        <th style="width: 20%">Name (EN)</th>
                        <th style="width: 15%">Major</th>
                        <th style="width: 15%">Access Expires</th>
                        <th style="width: 15%" class="text-center">Actions</th>
                    </tr>
                </ng-template>
                
                <ng-template pTemplate="body" let-student>
                    <tr>
                        <td><span class="font-mono font-semibold">{{ student.student_code }}</span></td>
                        <td>{{ student.name_th }}</td>
                        <td>{{ student.name_en }}</td>
                        <td>
                            <span class="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                {{ student.major }}
                            </span>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <i class="pi" [ngClass]="isExpired(student.password_expires_at) ? 'pi-exclamation-circle text-red-500' : 'pi-check-circle text-green-500'"></i>
                                <span [class.text-red-500]="isExpired(student.password_expires_at)" [class.font-medium]="isExpired(student.password_expires_at)">
                                    {{ student.password_expires_at ? (student.password_expires_at | date:'dd/MM/yyyy') : 'No Expiry' }}
                                </span>
                            </div>
                        </td>
                        <td class="text-center">
                            <button pButton icon="pi pi-calendar-plus" label="Set Expiry" 
                                    class="p-button-outlined p-button-sm p-button-secondary"
                                    (click)="openEditDialog(student)"></button>
                        </td>
                    </tr>
                </ng-template>

                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="6" class="text-center p-6">
                            <div class="flex flex-col items-center justify-center text-slate-400 py-8">
                                <i class="pi pi-search text-4xl mb-3 opacity-50"></i>
                                <p class="m-0 font-medium">No students found matching your search.</p>
                                <p class="text-sm m-0 mt-1">Try adjusting your filters.</p>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog -->
        <p-dialog [(visible)]="displayDialog" header="Manage Access Duration" [modal]="true" [style]="{width: '450px'}" 
                  [draggable]="false" [resizable]="false" styleClass="rounded-xl overflow-hidden">
            <div *ngIf="selectedStudent" class="flex flex-col gap-4 py-2">
                <div class="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-3">
                    <i class="pi pi-info-circle text-blue-500 mt-1"></i>
                    <div>
                        <p class="m-0 font-bold text-slate-700">{{ selectedStudent.name_th }}</p>
                        <p class="m-0 text-sm text-slate-500 text-xs">Code: {{ selectedStudent.student_code }}</p>
                    </div>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label for="expiry" class="font-medium text-slate-700">Account Expiration Date</label>
                    <p-datepicker [(ngModel)]="expiryDate" appendTo="body" dateFormat="dd/mm/yy" 
                                [showIcon]="true" inputId="expiry" 
                                styleClass="w-full" inputStyleClass="w-full"
                                placeholder="Select a date..."></p-datepicker>
                    <small class="text-slate-500">
                        <i class="pi pi-info-circle text-xs mr-1"></i>
                        Leave blank to remove expiration (Access forever).
                    </small>
                </div>
            </div>
            
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2 pt-2">
                    <button pButton label="Cancel" icon="pi pi-times" class="p-button-text" (click)="displayDialog = false"></button>
                    <button pButton label="Save Changes" icon="pi pi-check" (click)="saveExpiry()" class="p-button-primary"></button>
                </div>
            </ng-template>
        </p-dialog>
    </div>
  `,
    styles: [`
    :host ::ng-deep .p-datatable-thead > tr > th {
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
        border-color: #e2e8f0;
    }
    :host ::ng-deep .p-datatable-tbody > tr > td {
        border-color: #e2e8f0;
    }
    :host ::ng-deep .p-button { 
        border-radius: 8px; 
    }
    :host ::ng-deep .p-inputtext { 
        border-radius: 8px; 
    }
    :host ::ng-deep .p-dialog .p-dialog-header {
        border-bottom: 1px solid #e2e8f0;
    }
    .page-container { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
    .text-primary { color: var(--primary); }
  `]
})
export class StudentManagementComponent implements OnInit {
    students: Student[] = [];
    totalRecords = 0;
    loading = false;
    searchTerm = '';

    displayDialog = false;
    selectedStudent: Student | null = null;
    expiryDate: Date | null = null;

    constructor(
        private officerStudentService: OfficerStudentService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents(event?: any) {
        this.loading = true;

        // Handle LazyLoadEvent
        let page = 1;
        if (event) {
            page = (event.first / event.rows) + 1;
        }

        this.officerStudentService.getStudents({
            page: page,
            search: this.searchTerm
        }).subscribe({
            next: (res) => {
                // Determine if res.data is directly the array or paginated object, usually Laravel returns { data: [...], total: ... }
                // or { data: { data: [...], total: ... } } depending on resource.
                // Assuming standard pagination structure based on previous code usage
                if (res.data) {
                    this.students = res.data;
                    this.totalRecords = res.total;
                } else {
                    // Fallback if structure is different
                    this.students = [];
                }
                this.loading = false;
                console.log('Students loaded:', this.students);
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load students' });
                console.error(err);
            }
        });
    }

    refresh() {
        this.searchTerm = '';
        this.loadStudents();
    }

    isExpired(dateStr: string | null): boolean {
        if (!dateStr) return false;
        // Compare dates without time to avoid issues with same-day expiration
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(dateStr);
        exp.setHours(0, 0, 0, 0);
        return exp < today;
    }

    getExpiryClass(dateStr: string | null): string {
        if (this.isExpired(dateStr)) return 'bg-red-50 text-red-600 border border-red-100';
        if (!dateStr) return 'bg-gray-50 text-gray-600 border border-gray-100';
        return 'bg-green-50 text-green-600 border border-green-100';
    }

    openEditDialog(student: Student) {
        this.selectedStudent = student;
        this.expiryDate = student.password_expires_at ? new Date(student.password_expires_at) : null;
        this.displayDialog = true;
    }

    saveExpiry() {
        if (!this.selectedStudent) return;

        // Convert date to YYYY-MM-DD format for API
        let dateStr = null;
        if (this.expiryDate) {
            const offset = this.expiryDate.getTimezoneOffset();
            const date = new Date(this.expiryDate.getTime() - (offset * 60 * 1000));
            dateStr = date.toISOString().split('T')[0];
        }

        this.officerStudentService.updatePasswordExpiry(this.selectedStudent.id, dateStr).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Access duration updated successfully' });
                this.displayDialog = false;
                this.loadStudents(); // Refresh list to show new expiry
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update access duration' });
                console.error(err);
            }
        });
    }
}
