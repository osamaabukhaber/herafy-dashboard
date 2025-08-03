import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from "./features/user/user";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'herfy-dashboard';
}
