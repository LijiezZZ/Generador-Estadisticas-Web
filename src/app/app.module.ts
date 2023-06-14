import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from 'src/environments/environment.development';
import { MaterialModule } from './added-modules/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from './services/user.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ChartComponent } from './chart/chart.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ResultComponent } from './result/result.component';
import { DatePipe } from '@angular/common';
import { HistorialComponent } from './historial/historial.component';
import { HistorialChartComponent } from './historial-chart/historial-chart.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { SubscriptionComponent } from './subscription/subscription.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    LoginComponent,
    RegisterComponent,
    ChartComponent,
    NoAccessComponent,
    NotFoundComponent,
    ResultComponent,
    HistorialComponent,
    HistorialChartComponent,
    ProfileComponent,
    AdminComponent,
    SubscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    provideFirestore(() => getFirestore()),

    MaterialModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }, UserService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
