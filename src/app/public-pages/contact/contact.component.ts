import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="contact-container animate-fade-in">
      <div class="contact-card glass-panel">
        <div class="header">
          <div class="icon-wrapper">
             <span class="header-icon">☎️</span>
          </div>
          <h2>ติดต่อเจ้าหน้าที่</h2>
          <p>ช่องทางการติดต่อสอบถามสำหรับนักศึกษา</p>
        </div>

        <div class="contact-list">
          <!-- Facebook -->
          <a href="https://www.facebook.com/" target="_blank" class="contact-item facebook">
            <div class="item-icon">
              <!-- Facebook Icon SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </div>
            <div class="item-content">
              <h3>Facebook Page</h3>
              <span>งานฝึกงาน วิทยาการคอมพิวเตอร์</span>
            </div>
            <span class="arrow">→</span>
          </a>

          <!-- Line -->
          <a href="https://line.me/" target="_blank" class="contact-item line">
            <div class="item-icon">
              <!-- Line Icon SVG (Simplified) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-6.092z"/></svg>
            </div>
            <div class="item-content">
              <h3>Line Official</h3>
              <span>@internship.cmru</span>
            </div>
            <span class="arrow">→</span>
          </a>

          <!-- Phone -->
          <a href="tel:053123456" class="contact-item phone">
            <div class="item-icon">
              <!-- Phone Icon SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.057 15.057 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.59 3.96.97.97 0 007.61 3H4.21a1 1 0 00-.98 1.18c.84 9.54 9.46 18.16 19 19.01a1 1 0 001.18-.98v-3.41a.97.97 0 00-.96-.98z"/></svg>
            </div>
            <div class="item-content">
              <h3>เบอร์โทรศัพท์</h3>
              <span>053-xxx-xxx (พี่เจ้าหน้าที่)</span>
            </div>
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .contact-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }

    .contact-card {
      width: 100%;
      max-width: 500px;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      border: 1px solid white;
      text-align: center;
    }

    .header { margin-bottom: 2.5rem; }
    
    .icon-wrapper {
        width: 80px; height: 80px;
        background: var(--bg-hover);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.5rem;
        box-shadow: var(--shadow-sm);
    }
    .header-icon { font-size: 2.5rem; }

    .header h2 {
      font-size: 1.8rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .header p { color: var(--text-muted); font-size: 1rem; }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 16px;
      background: white;
      border: 1px solid var(--border-color);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .contact-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: currentColor;
    }

    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .item-icon svg { width: 24px; height: 24px; }

    .item-content { flex: 1; text-align: left; }
    .item-content h3 { font-size: 1rem; font-weight: 600; margin: 0; color: var(--text-main); }
    .item-content span { font-size: 0.9rem; color: var(--text-muted); }

    .arrow { color: var(--text-dim); font-size: 1.2rem; transition: 0.3s; }
    .contact-item:hover .arrow { transform: translateX(5px); color: var(--primary); }

    /* Brand Colors */
    .facebook .item-icon { background: #1877F2; }
    .facebook:hover { color: #1877F2; background: #e7f1ff; }
    
    .line .item-icon { background: #00B900; }
    .line:hover { color: #00B900; background: #e6f7e6; }
    
    .phone .item-icon { background: var(--primary); }
    .phone:hover { color: var(--primary); background: var(--bg-hover); }
  `]
})
export class ContactComponent { }
