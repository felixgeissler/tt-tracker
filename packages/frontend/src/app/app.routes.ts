import { Routes } from '@angular/router';
import { authenticatedGuard } from './features/auth/authenticated.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { notAuthenticatedGuard } from './features/auth/not-authenticated.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { HomeComponent } from './features/home/home.component';
import { LandingComponent } from './features/landing/landing.component';
import { LeagueListComponent } from './features/league/league-list/league-list.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    data: { pageLayout: 'landing' },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notAuthenticatedGuard],
    data: { pageLayout: 'landing' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [notAuthenticatedGuard],
    data: { pageLayout: 'landing' },
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [],
    data: { pageLayout: 'landing' },
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticatedGuard],
    data: { pageLayout: 'app' },
  },
  {
    path: 'leagues',
    component: LeagueListComponent,
    canActivate: [authenticatedGuard],
    data: { pageLayout: 'app' },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { pageLayout: 'landing' },
  },
];
