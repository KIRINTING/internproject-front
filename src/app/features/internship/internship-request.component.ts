import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { InternshipService } from './services/internship';
import { AuthService } from '../../auth/auth.service';
import { StudentService } from '../student-info/student.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-internship-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ConfirmPopupModule],
  providers: [InternshipService, ConfirmationService],
  templateUrl: './internship-request.component.html',
  styleUrl: './internship-request.component.css'
})
export class InternshipRequestComponent implements OnInit {
  requestForm!: FormGroup;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private internshipService: InternshipService,
    private authService: AuthService,
    private studentService: StudentService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudentData();
  }

  initializeForm(): void {
    this.requestForm = this.fb.group({
      intern_id: ['INT' + Date.now(), Validators.required],
      // Student Information (fields 1-6)
      student_id: ['', Validators.required], // Added for API compatibility
      student_code: ['', Validators.required],
      title: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      class_group: ['', Validators.required],
      registration_status: ['', Validators.required],
      // Company Information (fields 7-11)
      company_name: ['', Validators.required],
      position: ['', Validators.required],
      job_description: ['', Validators.required],
      company_address: ['', Validators.required],
      company_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      // Coordinator Information (fields 12-14)
      coordinator_name: ['', Validators.required],
      coordinator_position: ['', Validators.required],
      coordinator_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      // Approver Information (fields 15-16)
      approver_name: ['', Validators.required],
      approver_position: ['', Validators.required],
      // Location & Photo (fields 17-18)
      google_map_coordinates: [''],
      // Additional (field 21)
      notes: ['']
    });
  }

  loadStudentData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'student') {
      // Fetch full student data from API
      this.studentService.getProfile().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const student = response.data;
            // Parse Thai name to extract first and last name
            const nameParts = student.name_th?.split(' ') || [];
            this.requestForm.patchValue({
              student_id: student.student_code,
              student_code: student.student_code,
              first_name: nameParts[0] || '',
              last_name: nameParts.slice(1).join(' ') || '',
              phone: student.phone || ''
            });
          }
        },
        error: (error) => {
          console.error('Error loading student data:', error);
          // Fallback to basic user data
          const studentCode = currentUser.username || '';
          this.requestForm.patchValue({
            student_id: studentCode,
            student_code: studentCode
          });
        }
      });
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(event: Event): void {
    if (this.requestForm.invalid) {
      Object.keys(this.requestForm.controls).forEach(key => {
        this.requestForm.get(key)?.markAsTouched();
      });
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'ยืนยันกาส่งข้อมูล? ข้อมูลไม่สามารถแก้ไขได้หลังจากส่ง',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;

        const formData = new FormData();

        // Append all form fields
        Object.keys(this.requestForm.value).forEach(key => {
          const value = this.requestForm.value[key];
          if (value !== null && value !== '') {
            formData.append(key, value);
          }
        });

        // Append photo if selected
        if (this.selectedPhoto) {
          formData.append('photo', this.selectedPhoto);
        }

        this.internshipService.submitRequest(formData).subscribe({
          next: (response: any) => {
            const message = response.message || 'ส่งคำขออนุมัติสำเร็จ! รอการพิจารณาจากอาจารย์';
            alert(message);
            this.requestForm.reset();
            this.selectedPhoto = null;
            this.photoPreview = null;
            this.isLoading = false;
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error submitting request:', error);
            let errorMessage = 'เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่อีกครั้ง';

            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.error?.errors) {
              const errors = Object.values(error.error.errors).flat();
              errorMessage = errors.join('\n');
            }

            alert(errorMessage);
            this.isLoading = false;
          }
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.requestForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
