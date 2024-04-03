import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { title } from 'process';
import { FirebaseTasksService } from 'src/app/service/firebase-tasks.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  currentAction: string | null = null;
  addNewTask: FormGroup | undefined;
  formError: boolean = false;
  errorText: string = '';
  alert: boolean = false;
  minDate: any;
  dateMatchError: boolean = false;
  task: any;
  id: any = '';
  successMessage: string = '';
  statusDdw = [
    { value: 'To-Do', label: 'To-Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' }
  ]

  constructor(
    private fireTaskServ: FirebaseTasksService,
    private fb: FormBuilder,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id != null && this.id?.length > 0) {
        this.currentAction = 'Edit';
        this.initEditForm()
      } else {
        this.initAddForm()
        this.currentAction = 'Add';
      }
    })
  }

  initAddForm() {
    this.addNewTask = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      status: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      hoursSpent: ['0'],
      originalEstimate: ['0', [Validators.required]]
    })
    this.initiateValidator();
  }

  initEditForm() {
    this.fireTaskServ.getTaskDocById(this.id).subscribe(res => {
      if (res) {
        this.task = res;
        this.addNewTask = this.fb.group({
          title: [this.task.title, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
          description: [this.task.description, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
          status: [this.task.status, [Validators.required]],
          startDate: [this.task.startDate ? new Date(this.task.startDate) : '', [Validators.required]],
          endDate: [this.task.endDate ? new Date(this.task.endDate) : ''],
          hoursSpent: [this.task.hoursSpent],
          originalEstimate: [this.task.originalEstimate, [Validators.required]]
        })
        this.initiateValidator();
      }
    })

  }

  initiateValidator() {
    this.addNewTask?.controls['startDate'].valueChanges.subscribe(value => {
      this.dateMatchError = false;
      this.minDate = new Date(value);
      if (this.addNewTask?.controls.endDate.value) {
        const endDTMS = new Date(this.addNewTask?.controls.endDate.value);
        const startDtMs = this.minDate.getTime();
        if (endDTMS < startDtMs) {
          this.dateMatchError = true;
          this.addNewTask.controls.endDate.setValue('', { emitEvent: false });
        } else {
          this.dateMatchError = false;
        }
      }
    });
    this.addNewTask?.controls['endDate'].valueChanges.subscribe(value => {
      this.dateMatchError = false; // Coz Min Date logic is applied to End Date Calendar Input
    })
  }

  onSubmit(f: FormGroup) {
    if (f.valid) {
      const controls: any = this.addNewTask?.controls;
      const requestBody = {
        description: controls.description.value.trim(),
        endDate: controls.endDate.value ? new Date(controls.endDate.value).getTime() : '',
        hoursSpent: controls.hoursSpent.value ? controls.hoursSpent.value : 0,
        originalEstimate: controls.originalEstimate.value,
        startDate: controls.startDate.value ? new Date(controls.startDate.value).getTime() : '',
        status: controls.status.value,
        title: controls.title.value.trim(),
      }
      if (this.currentAction === 'Add') {
        this.createNewTask(requestBody);
      } else {
        this.updateTask(requestBody);
      }
    }
  }

  createNewTask(requestBody: any) {
    this.fireTaskServ.addTask(requestBody).then((res: any) => {
      this.alert = true;
      this.successMessage = "New task has been created successfully!"
      this.addNewTask?.disable();
      setTimeout(() => {
        this.alert = false;
        this.addNewTask?.reset({});
        this.route.navigate(['/home/tasks/list']);
      }, 3000);
    })
      .catch((err) => {
        this.formError = true;
        this.errorText = "Please enter valid data to proceed."
      });
  }

  updateTask(requestBody: any) {
    this.fireTaskServ.updateTask(this.id, requestBody).then((res: any) => {
      this.addNewTask?.disable();
      this.alert = true;
      this.successMessage = "Your task details are updated successfully! "
      setTimeout(() => {
        this.alert = false;
        this.addNewTask?.reset({});
        this.route.navigate(['/home/tasks/list']);
      }, 3000);
    })
  }

  back() {
    this.route.navigate(['/home/dashboard'])
  }

  start(val: any) {
    let value = val as HTMLElement
  }

}
