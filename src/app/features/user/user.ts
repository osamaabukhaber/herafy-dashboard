import { Component, OnInit } from '@angular/core';
import {CommonModule } from '@angular/common';
import { UserService } from '../../services/user-services/user.service';
import { IUser } from '../../models/iuser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormsModule],
  templateUrl:'./user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  users: IUser[] = [];
  loading = true;
  error: string | null = null;
  userProps: IUser = {} as IUser;
  editingUserId: string | null = null
  filterByRole:string=''
  roles: string[] = ['admin', 'User', 'Vendor'];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 1;
  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load users.';
        this.loading = false;
      },
    });
    // fetch users and pagination
    this.userPagination();
  }
 userPagination(): void{
  this.loading = true;
  this.userService.getAllUsers(this.currentPage, this.limit).subscribe({
    next:(res)=>{
      this.users = res.data.users;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error:(err) => {
      this.error = err?.error?.message || 'Falied';
      this.loading = false
      
    }
  })
 }
 refreshUsers(): void {
  this.currentPage = 1;
  this.userPagination();
 }
 nextPage() :void{
  this.currentPage++;
  this.userPagination();
 }
 previousPage():void{
  if(this.currentPage > 1){
    this.currentPage--;
    this.userPagination()
  }
 }
 canPaginate():boolean{
  return this.users.length === this.limit;
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      },
    });
  }
  // start edit function to make the body ready
startEdit(user: IUser): void {
  this.editingUserId = user._id;
  this.userProps = { ...user };
}

cancelEdit(): void {
  this.editingUserId = null;
  this.userProps = {} as IUser;
}

updateUser(): void {
  console.log("saved clicked", this.userProps)
  if (!this.userProps._id) {
    console.log("error can't get id");
    return;
  }

  const updatedData = {
    firstName: this.userProps.firstName,
    lastName: this.userProps.lastName,
    email: this.userProps.email,
    role: this.userProps.role,
    phone: this.userProps.phone
  };
  console.log("saving the user data", this.userProps._id, updatedData)
  this.userService.updateUserByAdmin(this.userProps._id, updatedData).subscribe({
    next: (response) => {
      const index = this.users.findIndex(user => user._id === this.userProps._id);
      if (index !== -1) {
        this.users = this.users.map((u) => 
        u._id === this.userProps._id ? {...u, ...updatedData} : u)
      }
      this.editingUserId = null;
      this.userProps = {} as IUser;
      console.log('User updated successfully');
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error("Update error:", error);
    }
  });
}
// filter user by role using the two way binding
filterRole(value: string):IUser[]{
  if (!this.filterByRole) {
    return this.users; 
  }
  value = value.toLowerCase()
  return this.users.filter((pram: IUser)=>
    pram.role?.toLowerCase().includes(value)
  )
}
}
