import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const components = [
    NavbarComponent,
]

@NgModule({
    declarations: [components],
    imports: [
        CommonModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    exports: [components]
})

export class ComponentModule { }