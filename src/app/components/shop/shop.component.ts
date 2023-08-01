import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCookieService } from 'src/app/services/app-cookie.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{

  hint1: String = '';
  hint2: String = '';
  hint3: String = '';
  hint4: String = '';
  hint5: String = '';
  hint1Status: boolean = false;
  hint2Status: boolean = false;
  hint3Status: boolean = false;
  hint4Status: boolean = false;
  hint5Status: boolean = false;
  isDisabled: boolean = false
  hintPrice: number = 3334;
  score: number = 0;
  buttonText: String = 'Buy: '+ this.hintPrice+ ' pts. ' 

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    
    this.userService.getHint().subscribe({
      next: (response) => {
        this.score = response.score
        this.hint1 = response.hint1
        this.hint2 = response.hint2
        this.hint3 = response.hint3
        this.hint4 = response.hint4
        this.hint5 = response.hint5
        if(this.hint1 != null) {
          this.hint1Status=true;
          this.buttonText = 'Buy Hint : '+ this.hintPrice+ ' point ' 
        }
        if(this.hint2 != null) {
          this.hint2Status=true;
          this.buttonText = 'Buy Hint : '+ this.hintPrice+ ' point ' 
        }
        if(this.hint3 != null) {
          this.hint3Status=true;
          this.buttonText = 'Buy Hint : '+ this.hintPrice+ ' point ' 
        }
        if(this.hint4 != null) {
          this.hint4Status=true;
          this.buttonText = 'Buy Hint : '+ this.hintPrice+ ' point ' 
        }
        if(this.hint5 != null) {
          this.hint5Status=true;
          this.buttonText = 'Nothing'
          this.isDisabled = true;
        }
        console.log(this.score)
        console.log(this.hintPrice)
        if(this.score < this.hintPrice) {
          this.buttonText = "not enough pt."
          this.isDisabled = true;
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  buyHint(): void{
    this.score-=this.hintPrice
    this.userService.buyHint(this.score).subscribe({
      complete: () => {
        console.log("complete")
        window.location.reload();
      }
    })
  }

  onFrontCardClick(cardItem: HTMLElement) {
    console.log(cardItem)
    const cardStack = cardItem.parentElement;
    console.log(cardStack)
    if(cardStack==null) return; 
    if (!cardStack.classList.contains('flipped')) {
      cardStack.classList.remove('normal')
      cardStack.classList.add('flipped')
    }
  }

  onBackCardClick(cardItem: HTMLElement) {
    
    const cardStack = cardItem.parentElement;
    if(cardStack==null) return; 
    if (cardStack.classList.contains('flipped')) {
      cardStack.classList.remove('flipped')
      cardStack.classList.add('normal')
    }
  }


  
}
