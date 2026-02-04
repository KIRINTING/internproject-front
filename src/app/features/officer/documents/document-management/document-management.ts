import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentService, Document } from '../../services/document';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule, ConfirmPopupModule],
  providers: [DocumentService, ConfirmationService],
  templateUrl: './document-management.html',
  styleUrl: './document-management.css'
})
export class DocumentManagement implements OnInit {
  documents: Document[] = [];
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      type: ['form', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => this.documents = docs,
      error: (err) => console.error('Error loading documents', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onUpload() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('title', this.uploadForm.get('title')?.value);
    formData.append('type', this.uploadForm.get('type')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);
    formData.append('file', this.selectedFile);

    this.documentService.uploadDocument(formData).subscribe({
      next: (doc) => {
        this.documents.unshift(doc);
        this.uploadForm.reset({ type: 'form' });
        this.selectedFile = null;
        alert('Document uploaded successfully');
      },
      error: (err) => {
        console.error('Error uploading document', err);
        alert('Failed to upload document');
      }
    });
  }

  deleteDocument(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'คุณต้องการลบเอกสารนี้ใช่หรือไม่?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ลบ',
      rejectLabel: 'ยกเลิก',
      accept: () => {
        this.documentService.deleteDocument(id).subscribe({
          next: () => {
            this.documents = this.documents.filter(d => d.id !== id);
          },
          error: (err) => {
            console.error('Error deleting document', err);
            alert('Failed to delete document');
          }
        });
      }
    });
  }

  getFileUrl(path: string): string {
    // Assuming Laravel storage link is accessible via /storage/
    // path stored in DB might be "documents/filename.ext"
    // So we need public url.
    return `http://localhost:8000/storage/${path}`;
  }
  getBadgeClass(type: string): string {
    switch (type) {
      case 'form': return 'badge-primary';
      case 'manual': return 'badge-success';
      case 'announcement': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
