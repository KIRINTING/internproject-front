import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.css',
})
export class OfficerDashboard {

}
