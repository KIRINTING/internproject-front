import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-registration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './company-registration.component.html',
    styles: [`
    :host {
        --text-main: #1e293b;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --primary: #3b82f6;
        --danger: #ef4444;
        --bg-hover: #f8fafc;
    }
    .page-container { max-width: 800px; margin: 2rem auto; padding: 1rem; }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    .form-header { text-align: center; margin-bottom: 2.5rem; }
    .form-header h2 { 
      font-size: 1.75rem; 
      color: var(--text-main); 
      margin-bottom: 0.5rem;
      display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    }
    .form-header p { color: var(--text-muted); }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .full-width { grid-column: 1 / -1; }
    
    .form-group { margin-bottom: 0; }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-main);
      font-weight: 500;
      font-size: 0.95rem;
    }
    .required { color: var(--danger); }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.2s;
      background: var(--bg-hover);
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .btn-submit {
      width: 100%;
      padding: 1rem;
      margin-top: 2rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) {
      filter: brightness(110%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .success-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.9);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    .success-card {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border: 1px solid var(--border-color);
      max-width: 400px;
      width: 90%;
    }
    .success-icon { font-size: 4rem; margin-bottom: 1rem; display: block; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .success-card h3 { color: var(--text-main); margin-bottom: 0.5rem; }
    .success-card p { color: var(--text-muted); margin-bottom: 1.5rem; }
    
    .btn-outline {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 2px solid var(--primary);
        color: var(--primary);
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-outline:hover {
        background: var(--primary);
        color: white;
    }

    .location-input-group {
        display: flex;
        gap: 0.5rem;
    }
    .btn-icon {
        padding: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: 2px solid var(--border-color);
        background: white;
        cursor: pointer;
        color: var(--text-muted);
    }
    .btn-icon:hover { border-color: var(--primary); color: var(--primary); }

    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `]
})
export class CompanyRegistrationComponent {
    form: FormGroup;
    isSubmitting = false;
    isSuccess = false;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router
    ) {
        this.form = this.fb.group({
            company_id: [this.generateId(), Validators.required],
            name: ['', Validators.required],
            position: ['', Validators.required], // Contact position or Business Type
            location: ['', Validators.required], // City/Province
            address_details: [''],
            tel: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            student_vacancy: [1, [Validators.required, Validators.min(1)]],
            latitude: [null],
            longitude: [null]
        });
    }

    generateId() {
        return 'CP' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.form.patchValue({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    alert('ไม่สามารถระบุตำแหน่งได้ กรุณากรอกด้วยตนเอง');
                }
            );
        } else {
            alert('Browser ของคุณไม่รองรับการระบุตำแหน่ง');
        }
    }

    openMaps() {
        const lat = this.form.get('latitude')?.value;
        const lng = this.form.get('longitude')?.value;
        if (lat && lng) {
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        } else {
            window.open('https://www.google.com/maps', '_blank');
        }
    }

    onSubmit() {
        if (this.form.valid) {
            this.isSubmitting = true;
            this.http.post(`${environment.apiUrl}/companies`, this.form.value)
                .subscribe({
                    next: () => {
                        this.isSuccess = true;
                        this.isSubmitting = false;
                    },
                    error: (err) => {
                        console.error('Registration failed', err);
                        this.isSubmitting = false;
                        alert('เกิดข้อผิดพลาดในการลงทะเบียน: ' + (err.error?.message || err.message));
                    }
                });
        } else {
            Object.keys(this.form.controls).forEach(key => {
                const control = this.form.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    }

    backToHome() {
        this.router.navigate(['/']);
    }
}
