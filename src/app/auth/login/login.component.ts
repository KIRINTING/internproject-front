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
      background-color: var(--bg-main);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      /* Add a subtle grid or tech background pattern */
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 20%);
    }

    .login-container {
      display: flex;
      max-width: 1100px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      min-height: 600px;
    }

    /* Left Panel - Login Form */
    .login-panel {
      flex: 1;
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      background: #758195; /* Cool Grey */
      position: relative;
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
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .university-logo span {
      font-size: 1rem;
      color: white;
      font-weight: 500;
      font-family: 'Prompt', sans-serif;
    }

    .login-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .login-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.3;
      letter-spacing: -0.5px;
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
      color: #e2e8f0; /* Light Grey */
      font-weight: 500;
    }

    .required {
      color: var(--danger);
      margin-left: 2px;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1px solid transparent;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      background: #f1f5f9; /* Very Light Grey/White */
      color: #1f2937; /* Dark Text */
      appearance: none;
    }
    
    .form-input::placeholder {
      color: #94a3b8;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: auto;
      box-shadow: 0 4px 6px -1px var(--primary-glow);
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px -1px var(--primary-glow);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      filter: grayscale(100%);
    }

    .footer-text {
      text-align: center;
      font-size: 0.8rem;
      color: #cbd5e1;
      margin-top: 1.5rem;
    }

    /* Right Panel - Illustration */
    .illustration-panel {
      flex: 1;
      background: #6a768a; /* Blue Grey */
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
      filter: drop-shadow(0 0 10px rgba(59,130,246,0.3));
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
      color: var(--text-main);
      margin-top: 2rem;
      text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
      font-family: 'JetBrains Mono', monospace;
    }

    .tech-subtext {
      font-size: 1.1rem;
      color: var(--primary-light);
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
      background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
      border-radius: 50%;
      top: -100px;
      right: -100px;
      opacity: 0.2;
    }

    .illustration-panel::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%);
      border-radius: 50%;
      bottom: -50px;
      left: -50px;
      opacity: 0.2;
    }

    /* Responsive */
    @media (max-width: 968px) {
      .login-container {
        flex-direction: column;
      }

      .illustration-panel {
        min-height: 250px;
        order: -1;
        border-left: none;
        border-bottom: 1px solid rgba(255,255,255,0.05);
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
