import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ChartComponent } from './chart/chart.component';
import { HistorialChartComponent } from './historial-chart/historial-chart.component';
import { HistorialComponent } from './historial/historial.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ResultComponent } from './result/result.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AdminGuard } from './_guards/admin.guard';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chart', component: ChartComponent, canActivate: [AuthGuard] },
  { path: 'result', component: ResultComponent, canActivate: [AuthGuard] },
  { path: 'historial', component: HistorialComponent },
  { path: 'historial-chart', component: HistorialChartComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: NotFoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
