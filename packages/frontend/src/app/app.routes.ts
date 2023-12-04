import { Routes } from '@angular/router';
import { authenticatedGuard } from './features/auth/authenticated.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { notAuthenticatedGuard } from './features/auth/not-authenticated.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { HomeComponent } from './features/home/home.component';
import { LeagueListComponent } from './features/league/league-list/league-list.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notAuthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [notAuthenticatedGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'leagues',
    component: LeagueListComponent,
    canActivate: [authenticatedGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
