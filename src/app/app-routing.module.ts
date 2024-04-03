import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tasks',
        loadChildren: ()=> import('./home/tasks/tasks.module').then(m=>m.TasksModule)
      },
    ]
  },
  {
    path: 'login',
    loadChildren: ()=> import('./auth-login/auth-login.module').then(m=>m.AuthLoginModule)
  },
  {
    path: '',
    redirectTo: '/login', pathMatch: 'full'
  },
  { 
    path: '**', //If path doesn't match anything reroute to /authentication/signin
    redirectTo: '/login', 
    pathMatch: 'full' 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
