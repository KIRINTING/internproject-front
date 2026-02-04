import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DailyLogService, DailyLog } from '../../services/daily-log.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-daily-log-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './daily-log-form.html',
  styleUrl: './daily-log-form.css'
})
export class DailyLogFormComponent implements OnChanges {
  @Input() studentId!: string;
  @Input() logToEdit?: DailyLog;
  @Output() formSubmit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dailyLogService: DailyLogService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      log_date: [new Date(), Validators.required],
      hours_worked: [8, [Validators.required, Validators.min(0.5), Validators.max(24)]],
      work_description: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['logToEdit'] && this.logToEdit) {
      this.form.patchValue({
        log_date: new Date(this.logToEdit.log_date),
        hours_worked: this.logToEdit.hours_worked,
        work_description: this.logToEdit.work_description
      });
    } else if (changes['logToEdit'] && !this.logToEdit) {
      this.form.reset({
        log_date: new Date(),
        hours_worked: 8,
        work_description: ''
      });
      this.selectedFile = null;
    }
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('student_code', this.studentId);

    const date = this.form.get('log_date')?.value;
    // Format date as YYYY-MM-DD
    const dateStr = date instanceof Date
      ? date.toISOString().split('T')[0]
      : date;

    formData.append('log_date', dateStr);
    formData.append('hours_worked', this.form.get('hours_worked')?.value.toString());
    formData.append('work_description', this.form.get('work_description')?.value);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    const request$ = this.logToEdit
      ? this.dailyLogService.updateLog(this.logToEdit.id!, formData)
      : this.dailyLogService.createLog(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Log saved successfully' });
        this.formSubmit.emit();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save log' });
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
