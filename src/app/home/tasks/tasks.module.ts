import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: TasksComponent
      },
      {
        path: 'add',
        loadChildren: () => import('../new-task/new-task.module').then(m => m.NewTaskModule)
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('../new-task/new-task.module').then(m => m.NewTaskModule)
      }
    ]
  }
]


@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TasksModule { }
