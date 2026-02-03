import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-container">
        <!-- Left Panel - Login Form -->
        <div class="login-panel">
          <div class="university-logo">
            <div class="logo-icon">🎓</div>
            <span>ภาควิชาคอมพิวเตอร์</span>
          </div>

          <div class="login-content">
            <h1 class="login-title">การเตรียม/ฝึกประสบการณ์</h1>
            
            <form (ngSubmit)="onLogin()" class="login-form">
              <!-- Username Field -->
              <div class="form-group">
                <label class="form-label">ชื่อผู้ใช้ / รหัสนักศึกษา<span class="required">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="username" 
                  name="username" 
                  class="form-input" 
                  placeholder="กรอกชื่อผู้ใช้ หรือ รหัสนักศึกษา"
                  required>
              </div>
              
              <!-- Password Field -->
              <div class="form-group">
                <label class="form-label">รหัสผ่าน / รหัสบัตรประชาชน<span class="required">*</span></label>
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  name="password" 
                  class="form-input" 
                  placeholder="กรอกรหัสผ่าน หรือ รหัสบัตรประชาชน"
                  required>
              </div>

              <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>

              <button type="submit" class="submit-button" [disabled]="isLoading">
                {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
              </button>

              <div class="footer-text">
                ระบบจัดการนักศึกษาฝึกงาน Cmru ภาควิชาคอมพิวเตอร์
              </div>
            </form>
          </div>
        </div>

        <!-- Right Panel - Illustration -->
        <div class="illustration-panel">
          <div class="illustration-content">
            <div class="illustration-placeholder">
              <div class="tech-icon">💡</div>
              <div class="tech-icon">🤖</div>
              <div class="tech-icon">📊</div>
              <div class="tech-text">AI & Technology</div>
              <div class="tech-subtext">Internship Management System</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #a8b5e8 0%, #c5b8e8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-container {
      display: flex;
      max-width: 1100px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      min-height: 600px;
    }

    /* Left Panel - Login Form */
    .login-panel {
      flex: 1;
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .university-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .university-logo span {
      font-size: 0.95rem;
      color: #333;
      font-weight: 500;
    }

    .login-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .login-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }

    .login-form {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #333;
      font-weight: 500;
    }

    .required {
      color: #e74c3c;
      margin-left: 2px;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      background: white;
      appearance: none;
    }

    .form-input:focus {
      outline: none;
      border-color: #7b8bc7;
      box-shadow: 0 0 0 3px rgba(123, 139, 199, 0.1);
    }

    .error-msg {
      background: #fee;
      color: #c33;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      border: 1px solid #fcc;
    }

    .submit-button {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #7b8bc7 0%, #9ba5d4 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: auto;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(123, 139, 199, 0.3);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .footer-text {
      text-align: center;
      font-size: 0.8rem;
      color: #999;
      margin-top: 1.5rem;
    }

    /* Right Panel - Illustration */
    .illustration-panel {
      flex: 1;
      background: linear-gradient(135deg, #7b8bc7 0%, #b8a8d8 50%, #d4a8c8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .illustration-content {
      text-align: center;
      z-index: 1;
    }

    .illustration-placeholder {
      padding: 2rem;
    }

    .tech-icon {
      font-size: 4rem;
      margin: 1rem;
      display: inline-block;
      animation: float 3s ease-in-out infinite;
    }

    .tech-icon:nth-child(2) {
      animation-delay: 0.5s;
    }

    .tech-icon:nth-child(3) {
      animation-delay: 1s;
    }

    .tech-text {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin-top: 2rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .tech-subtext {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 0.5rem;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    /* Decorative elements */
    .illustration-panel::before {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      top: -100px;
      right: -100px;
    }

    .illustration-panel::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      bottom: -50px;
      left: -50px;
    }

    /* Responsive */
    @media (max-width: 968px) {
      .login-container {
        flex-direction: column;
      }

      .illustration-panel {
        min-height: 250px;
        order: -1;
      }

      .login-panel {
        padding: 2rem 1.5rem;
      }

      .tech-icon {
        font-size: 2.5rem;
        margin: 0.5rem;
      }

      .tech-text {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.role === 'officer') {
            this.router.navigate(['/officer/dashboard']);
          } else if (currentUser?.role === 'mentor') {
            this.router.navigate(['/mentor/dashboard']);
          } else if (currentUser?.role === 'supervisor') {
            this.router.navigate(['/supervisor/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      },
      error: (err) => {
        const message = err.error?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง';
        this.errorMessage = message;
        this.isLoading = false;
      }
    });
  }
}
