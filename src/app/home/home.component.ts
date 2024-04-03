import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menuTitleObj = { title: '', subtitle: '' };
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getMainTitleName() {
    const url = this.router.url;
    if (url.indexOf('/tasks/list') >= 0) {
      this.menuTitleObj.title = 'Your Task Manager';
      this.menuTitleObj.subtitle = `View all your task list, create a new task, edit an existing task or delete a task.`
    } else if (url.indexOf('/tasks/add') >= 0) {
      this.menuTitleObj.title = 'Create a new Task.';
      this.menuTitleObj.subtitle = `Fill all the details below and proceed to add a new task.`
    } else if (url.indexOf('/tasks/edit') >= 0) {
      this.menuTitleObj.title = 'Edit your selected task';
      this.menuTitleObj.subtitle = `One click management for all your product related invoice creations and periodic notifications of your required data.`;
    } 


    return this.menuTitleObj;
  }

  logout(){
    localStorage.clear();
  }

}
