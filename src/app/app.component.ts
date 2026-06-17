import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Add this import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Add RouterOutlet to imports
  styleUrls: ['./app.component.scss'],
  template: `<router-outlet></router-outlet>`, // Use template with router-outlet
  // OR if you want to keep using templateUrl, update that file
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}