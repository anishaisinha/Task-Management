import { TestBed } from '@angular/core/testing';

import { FirebaseTasksService } from './firebase-tasks.service';

describe('FirebaseTasksService', () => {
  let service: FirebaseTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
