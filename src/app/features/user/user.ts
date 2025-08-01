import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../services/user-services/user.service';
import { IUser } from '../../models/iuser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { error, log } from 'console';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AsyncPipe, NgIf],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  users: IUser[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load users.';
        this.loading = false;
      },
    });
  }

  deleteUser(id: string) {
    if (!id) {
      console.error('User ID is undefined');
      return;
    }
    this.userService.deleteUserByAdmin(id).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user._id !== id);
        console.log('User deleted:', id);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      },
    });
  }
}
