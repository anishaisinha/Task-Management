import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Taskslist } from '../models/taskslist.model';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FirebaseTasksService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  
  getTaskDocById(id: string | undefined) {
    return this.fireStore.collection('tasklist').doc(id).valueChanges();
  }

  searchTaskDocByStat(status: string) {
    return this.fireStore.collection('tasklist', ref => ref.where('status', '==', status)).valueChanges();
  }

  getTaskList() {
    return this.fireStore.collection('tasklist').snapshotChanges();
  }

  addTask(task: any) {  
    return this.fireStore.collection('tasklist').add(task); 
  }

  updateTaskStatus(id:string, status:string){
    return this.fireStore.collection('tasklist').doc(id).update({status: status});
  }

  updateTask(id:string, task:any){
    return this.fireStore.collection('tasklist').doc(id).update(task);
  }

  deleteTask(id:string){
    return this.fireStore.collection('tasklist').doc(id).delete();
  }
}
