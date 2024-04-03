import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  loginForm: FormGroup | undefined;
  formError: boolean = false;
  errorText: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.initLogin();
  }

  initLogin() {
    this.loginForm = this.fb.group({
      id: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]]
    })

    this.initFormValidation();
  }

  initFormValidation() {
    this.loginForm?.valueChanges.subscribe(res => {
      this.formError = false;
      this.errorText = '';
    })
  }

  onSubmit(f: FormGroup) {
    if (f.valid) {
      let id = this.loginForm?.controls['id'].value.trim();
      let pwd = this.loginForm?.controls['pwd'].value.trim();
      this.auth.signInWithEmailAndPassword(id, pwd)
        .then((res: any) => {
          localStorage.setItem('user', JSON.stringify(res));
          localStorage.setItem('token', res.user?.stsTokenManager?.accessToken)
          this.router.navigate(['/home/tasks/list'])
        }).catch((err) => {
          this.formError = true;
          this.errorText = "Please enter valid credentials to proceed."
        });
    }
  }

}
