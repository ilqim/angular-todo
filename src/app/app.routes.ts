import { Routes } from '@angular/router';
import { TaskForm } from './components/task-form/task-form';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, // Ana sayfa için boş path
  { path: 'tasks/add', component: TaskForm },
  { path: 'tasks/edit/:id', component: TaskForm },
];