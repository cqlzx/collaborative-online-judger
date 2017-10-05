import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { DataService } from './services/data.service';
import { CollaborationService } from './services/collaboration.service';

import { ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ContributeFormComponent } from './components/contribute-form/contribute-form.component';
import { EditorComponent } from './components/editor/editor.component';




@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NavBarComponent,
    ContributeFormComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    ROUTING,
    FormsModule,
    HttpModule,
    Ng4LoadingSpinnerModule
  ],
  providers: [
    DataService,
    CollaborationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
