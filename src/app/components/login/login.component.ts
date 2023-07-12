import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  
  constructor(
    private userService: UserService
  ) {

  }

  onSubmit(): void {
    
    if(this.loginFormGroup.invalid) return;

    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password

    this.userService.login(username, password).subscribe({
      next: (response) => {
        console.log(response.token)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
