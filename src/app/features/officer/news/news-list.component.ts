import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoService, Info } from '../services/info.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-news-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmPopupModule],
    providers: [ConfirmationService],
    templateUrl: './news-list.component.html',
    styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
    infos: Info[] = [];
    filteredInfos: Info[] = [];
    searchTerm: string = '';

    // Modal State
    showModal = false;
    isEditing = false;
    currentInfo: Info = this.getEmptyInfo();

    constructor(
        private infoService: InfoService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadInfos();
    }

    loadInfos(): void {
        this.infoService.getInfos().subscribe({
            next: (data) => {
                this.infos = data;
                this.filteredInfos = data;
            },
            error: (err) => console.error('Failed to load news', err)
        });
    }

    onSearch(event: any): void {
        const term = event.target.value.toLowerCase();
        this.filteredInfos = this.infos.filter(info =>
            info.title.toLowerCase().includes(term) ||
            info.detail.toLowerCase().includes(term) ||
            info.info_id.toLowerCase().includes(term) ||
            info.category.toLowerCase().includes(term)
        );
    }

    isOverdue(dateString: string): boolean {
        return new Date(dateString) < new Date();
    }

    // CRUD Actions
    openCreateModal(): void {
        this.isEditing = false;
        this.currentInfo = this.getEmptyInfo(); // Generate or Reset
        this.showModal = true;
    }

    editInfo(info: Info): void {
        this.isEditing = true;
        this.currentInfo = { ...info }; // Clone
        // Format date for input[type="date"]
        if (this.currentInfo.due_date) {
            this.currentInfo.due_date = new Date(this.currentInfo.due_date).toISOString().split('T')[0];
        }
        this.showModal = true;
    }

    deleteInfo(info: Info, event: Event): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'คุณต้องการลบข่าวสารนี้ใช่หรือไม่?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'ลบ',
            rejectLabel: 'ยกเลิก',
            accept: () => {
                if (!info.id) return;
                this.infoService.deleteInfo(info.id).subscribe({
                    next: () => {
                        this.loadInfos();
                        alert('ลบเรียบร้อยแล้ว');
                    },
                    error: (err) => alert('เกิดข้อผิดพลาดในการลบ')
                });
            }
        });
    }

    saveInfo(): void {
        if (this.isEditing) {
            if (!this.currentInfo.id) return;
            this.infoService.updateInfo(this.currentInfo.id, this.currentInfo).subscribe({
                next: () => {
                    this.loadInfos();
                    this.closeModal();
                    alert('แก้ไขเรียบร้อยแล้ว');
                },
                error: (err) => alert('เกิดข้อผิดพลาดในการบันทึก')
            });
        } else {
            this.infoService.createInfo(this.currentInfo).subscribe({
                next: () => {
                    this.loadInfos();
                    this.closeModal();
                    alert('เพิ่มข่าวสารเรียบร้อยแล้ว');
                },
                error: (err) => alert('เกิดข้อผิดพลาดในการบันทึก')
            });
        }
    }

    closeModal(): void {
        this.showModal = false;
    }

    getEmptyInfo(): Info {
        return {
            info_id: 'INFO' + Date.now().toString().slice(-6),
            title: '',
            category: 'Announce',
            detail: '',
            due_date: new Date().toISOString().split('T')[0]
        };
    }
}
