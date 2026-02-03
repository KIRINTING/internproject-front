import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficerLayoutComponent } from './layout/officer-layout.component';
import { OfficerDashboardComponent } from './dashboard/officer-dashboard/officer-dashboard.component';
import { RequestListComponent } from './requests/request-list.component';
import { RequestDetailComponent } from './requests/request-detail.component';
import { NewsListComponent } from './news/news-list.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: OfficerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/officer-dashboard/officer-dashboard.component').then(m => m.OfficerDashboardComponent) },
      { path: 'requests', component: RequestListComponent },
      { path: 'requests/:id', component: RequestDetailComponent },
      { path: 'news', component: NewsListComponent },
      { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficerRoutingModule { }
