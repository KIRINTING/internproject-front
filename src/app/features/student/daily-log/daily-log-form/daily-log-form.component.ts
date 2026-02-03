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
      date: [new Date(), Validators.required],
      work_details: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['logToEdit'] && this.logToEdit) {
      this.form.patchValue({
        date: new Date(this.logToEdit.date),
        work_details: this.logToEdit.work_details
      });
    } else if (changes['logToEdit'] && !this.logToEdit) {
      this.form.reset({
        date: new Date(),
        work_details: ''
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
    formData.append('student_id', this.studentId);

    const date = this.form.get('date')?.value;
    // Format date as YYYY-MM-DD
    const dateStr = date instanceof Date
      ? date.toISOString().split('T')[0]
      : date;

    formData.append('date', dateStr);
    formData.append('work_details', this.form.get('work_details')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
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
