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
    if (window.DeviceMotionEvent) {
      // Event listener for device motion
      window.addEventListener('devicemotion', (event) => {
        // Get accelerometer values
        const acceleration = event.accelerationIncludingGravity;

        // Calculate change in acceleration
        if(acceleration==null) return;
        if(acceleration.x==null) return;
        if(acceleration.y==null) return;
        if(acceleration.z==null) return;
        const deltaX = Math.abs(this.lastX - acceleration.x);
        const deltaY = Math.abs(this.lastY - acceleration.y);
        const deltaZ = Math.abs(this.lastZ - acceleration.z);

        // Check if there was a significant change in acceleration
        if (deltaX > this.shakeThreshold || deltaY > this.shakeThreshold || deltaZ > this.shakeThreshold) {
          ++this.score;
          // Shake detected! Do something here...
          console.log('Shake:', this.score);
        }

        // Update last acceleration values
        this.lastX = acceleration.x;
        this.lastY = acceleration.y;
        this.lastZ = acceleration.z;
      });
    } else {
      console.log('Device motion not supported.');
    }
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
  requestPermission() {
    let requestButton = document.getElementById("startGame");
    if(requestButton) requestButton.style.display = "none";
    (DeviceOrientationEvent as any).requestPermission()
  }
  
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
