import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { ContributeFormComponent } from './components/contribute-form/contribute-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'problems',
    pathMatch: 'full'
  },
  {
    path: 'problems',
    component: ProblemListComponent
  },
  {
    path: 'problems/:id',
    component: ProblemDetailComponent
  },
  {
    path: 'contribute',
    component: ContributeFormComponent
  },
  {
    path: '**',
    redirectTo: 'problems'
  }
];

export const ROUTING = RouterModule.forRoot(routes);
