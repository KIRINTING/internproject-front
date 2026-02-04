import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InfoService, Info } from '../../public-pages/services/info.service';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, DatePickerModule, FormsModule],
    templateUrl: './landing-page.html',
    styleUrls: ['./landing-page.css']
})
export class LandingPageComponent implements OnInit {
    infos: Info[] = [];
    currentDate = new Date();

    constructor(private infoService: InfoService) { }

    ngOnInit(): void {
        this.infoService.getInfos().subscribe({
            next: (data) => {
                // Sort by latest and take top 3
                this.infos = data.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()).slice(0, 3);
            },
            error: (err) => console.error('Failed to load news:', err)
        });
    }

    getCategoryClass(category: string): string {
        switch (category) {
            case 'Announce': return 'tag-announce';
            case 'Important': return 'tag-important';
            case 'Guide': return 'tag-guide';
            default: return 'tag-announce';
        }
    }
}
