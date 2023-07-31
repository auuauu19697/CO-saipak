import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppCookieService } from 'src/app/services/app-cookie.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  score: number = 0;
  clickCounter = 0;
  errorText: String = "GOOD LUCK!";
  numberString: String = '0000'
  private shakeThreshold = 30;
  private shaked = 0;
  private lastX = 0;
  private lastY = 0;
  private lastZ = 0;

  constructor (
    private userService: UserService,
    private appCookieService: AppCookieService
  ) { }

  ngOnInit(): void {
    this.userService.getScore().subscribe({
      next: (response) => {
        this.score = response.score;
        this.setNumber(this.score)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  gameElements = {
    startButton: document.getElementById('startGame'),
    messageBox: document.querySelector('.game__message')
  };

  formatNumber = (number: number) => {
    return number.toString().padStart(4, '0'); // Format the number as a four-digit string with leading zeros
  }

  setNumber = (number :number) => {
    this.numberString = this.formatNumber(number);
  };

  setMessage = (msg: string) => {
    if(this.gameElements.messageBox)
    this.gameElements.messageBox.innerHTML = msg;
  }

  clickCount(): void{
    this.score++
    this.setNumber(this.score)
  
  }
  // requestPermission() {
  //   let requestButton = document.getElementById("startGame");
  //   if(requestButton) requestButton.style.display = "none";
  //   //DeviceOrientationEvent.requestPermission();
  // }
  
  saveClick(): void{
    this.userService.setScore(this.score).subscribe({
      error: (error) => {
        console.log(error)
        this.errorText = "Save Fail"
      },
      complete: () => {
        this.clickCounter=0;
        this.appCookieService.setScore(this.score);
        this.errorText = "Save Success"
      }
    })
  }
  

} 
