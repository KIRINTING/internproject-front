import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'register-company',
        loadComponent: () => import('./public-pages/company-registration/company-registration.component').then(m => m.CompanyRegistrationComponent)
    },
    {
        path: '',
        loadComponent: () => import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent),
        pathMatch: 'full'
    },
    {
        path: 'companies',
        loadComponent: () => import('./public-pages/company-list/company-list.component').then(m => m.CompanyListComponent)
    },
    {
        path: 'officer',
        loadChildren: () => import('./features/officer/officer-module').then(m => m.OfficerModule),
        canActivate: [authGuard]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'mentor',
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/mentor/dashboard/dashboard.component').then(m => m.MentorDashboardComponent)
                    },
                    {
                        path: 'assessment/:id',
                        loadComponent: () => import('./features/mentor/assessment/assessment.component').then(m => m.AssessmentComponent)
                    }
                ]
            },
            {
                path: 'supervisor',
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/supervisor/dashboard/dashboard.component').then(m => m.SupervisorDashboardComponent)
                    },
                    {
                        path: 'assessment/:id',
                        loadComponent: () => import('./features/supervisor/assessment/assessment.component').then(m => m.SupervisorAssessmentComponent)
                    }
                ]
            },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'student-info',
                loadComponent: () => import('./features/student-info/student-info.component').then(m => m.StudentInfoComponent)
            },
            {
                path: 'contact',
                loadComponent: () => import('./public-pages/contact/contact.component').then(m => m.ContactComponent)
            },
            {
                path: 'daily-logs',
                loadComponent: () => import('./features/student/daily-log/daily-log-list/daily-log-list.component').then(m => m.DailyLogListComponent)
            },
            // Internship Preparation Routes
            {
                path: 'internship/forms',
                loadComponent: () => import('./features/internship/download-forms.component').then(m => m.DownloadFormsComponent)
            },
            {
                path: 'internship/establishments',
                loadComponent: () => import('./features/internship/establishment-list.component').then(m => m.EstablishmentListComponent)
            },
            {
                path: 'internship/establishments/:id',
                loadComponent: () => import('./features/internship/establishment-detail/establishment-detail.component').then(m => m.EstablishmentDetailComponent)
            },
            {
                path: 'internship/requests',
                loadComponent: () => import('./features/internship/internship-request.component').then(m => m.InternshipRequestComponent)
            },
            {
                path: 'internship/results',
                loadComponent: () => import('./features/internship/internship-results.component').then(m => m.InternshipResultsComponent)
            },
            // Training Module Routes
            {
                path: 'training/criteria',
                loadComponent: () => import('./features/training/criteria-check.component').then(m => m.CriteriaCheckComponent)
            },
            {
                path: 'training/hours',
                loadComponent: () => import('./features/training/hours-check.component').then(m => m.HoursCheckComponent)
            },
            {
                path: 'training/orientation',
                loadComponent: () => import('./features/training/post-internship.component').then(m => m.PostInternshipComponent)
            },
            {
                path: 'training/report',
                loadComponent: () => import('./features/training/final-report.component').then(m => m.FinalReportComponent)
            },
            {
                path: 'training/evidence',
                loadComponent: () => import('./features/training/training-evidence.component').then(m => m.TrainingEvidenceComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
