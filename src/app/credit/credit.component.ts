import { Component, OnInit } from '@angular/core';
import { CreditService } from '../../service/creditService';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html'
})
export class CreditsComponent implements OnInit {

  balance: number = 0;
  transactions: any[] = [];
  email: string = '';

  constructor(private creditService: CreditService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      const parsed = JSON.parse(user);
      this.email = parsed.email;

      this.loadCredits();
    }
  }

  loadCredits() {
    this.creditService.getBalance(this.email).subscribe({
      next: (res) => {
        this.balance = res.balance;
        this.transactions = res.transactions;
      },
      error: (err) => {
        console.error('Error loading credits:', err);
      }
    });
  }
}