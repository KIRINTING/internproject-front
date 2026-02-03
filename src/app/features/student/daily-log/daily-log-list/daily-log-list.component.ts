import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyLogService, DailyLog } from '../../services/daily-log.service';
import { AuthService } from '../../../../auth/auth.service';
import { DailyLogFormComponent } from '../daily-log-form/daily-log-form.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-daily-log-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ImageModule,
    DailyLogFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './daily-log-list.html',
  styleUrl: './daily-log-list.css'
})
export class DailyLogListComponent implements OnInit {
  logs: DailyLog[] = [];
  studentId: string = '';

  logDialog: boolean = false;
  dialogHeader: string = 'New Daily Log';
  selectedLog?: DailyLog;

  loading: boolean = true;
  imageBaseUrl = environment.apiUrl.replace('/api', '/storage');

  constructor(
    private dailyLogService: DailyLogService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'student') {
      this.studentId = user.username; // maps to student_id
      this.loadLogs();
    } else {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not authorized or not found' });
    }
  }

  loadLogs() {
    this.loading = true;
    this.dailyLogService.getLogs(this.studentId).subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load logs' });
      }
    });
  }

  openNew() {
    this.selectedLog = undefined;
    this.dialogHeader = 'New Daily Log';
    this.logDialog = true;
  }

  editLog(log: DailyLog) {
    this.selectedLog = { ...log };
    this.dialogHeader = 'Edit Daily Log';
    this.logDialog = true;
  }

  deleteLog(log: DailyLog) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this log?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dailyLogService.deleteLog(log.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Log Deleted' });
            this.loadLogs();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete log' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.logDialog = false;
    this.selectedLog = undefined;
  }

  onFormSubmit() {
    this.hideDialog();
    this.loadLogs();
  }
}
