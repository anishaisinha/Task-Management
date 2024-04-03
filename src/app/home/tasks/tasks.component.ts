import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseTasksService } from 'src/app/service/firebase-tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  showSearch: boolean = false;
  taskList: any = []; taskListDup: any;
  showBoardView: boolean = false;
  taskListSubs: Subscription | null = null;
  searchForm!: FormGroup;
  statusDdw = [
    { value: 'To-Do', label: 'To-Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' }
  ]

  constructor(
    private fbTaskServ: FirebaseTasksService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this.taskListSubs = this.fbTaskServ.getTaskList().subscribe((res: any) => {
      this.taskList = []; 
      res.forEach((r: any) => {
        let id = { id: r.payload.doc.id };
        let data = r.payload.doc.data();
        let tasks = { ...id, ...data }
        this.taskList.push(tasks);
      });
      this.taskListDup = JSON.parse(JSON.stringify(this.taskList));
    });
  }

  initiateSearchForm() {
    this.searchForm = this.fb.group({
      title: [null, []],
      status: [null, []],
    });
    this.searchForm.enable();
    this.showSearch = true;
    let resetButton = document.getElementById('searchReset') as HTMLButtonElement;
    resetButton.disabled = true;
  }

  deleteTask(id: any) {
    this.fbTaskServ.deleteTask(id).then((res: any) => { console.log('Task Deleted') })
  }

  updateStatus(id: any) {
    var select = (document.getElementById(id)) as HTMLSelectElement;
    var status = select.options[select.selectedIndex].value;
    this.taskListSubs?.unsubscribe();
    this.fbTaskServ.updateTaskStatus(id, status).then((res: any) => {
      console.log('Status Updated')
      this.getTaskList();
      this.taskList = [];
    })
  }

  updateTask(id: string) {
    this.router.navigate(['/home/tasks/edit/' + id]);
  }

  searchStatus(event: any) {
    this.fbTaskServ.searchTaskDocByStat(event.value).subscribe(res => {
      this.taskList = res;
    })
  }

  resetData() {
    this.searchForm.reset();
    this.taskListSubs?.unsubscribe();
    this.getTaskList();
  }
  ngOnDestroy(): void {
    this.taskListSubs?.unsubscribe();
  }

}
