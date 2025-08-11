
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreServices } from '../../services/store-serivces/store-services';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-store-update-srore-component',
  imports: [CommonModule , ReactiveFormsModule, FormsModule],
  templateUrl: './store-update-srore-component.html',
  styleUrl: './store-update-srore-component.css'
})
export class StoreUpdateSroreComponent  implements OnInit {
  storeDataForm !: FormGroup;
    statusOptions: string[] = []
    constructor(private formBuilder: FormBuilder , private storeService: StoreServices , private router: Router , private active:ActivatedRoute ) {
      this.statusOptions = ['pending', 'approved', 'rejected', 'suspended'];
    }
    currentId !: string;
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      // current id from url
      this.storeDataForm = this.formBuilder.group({
        name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        address: this.formBuilder.group({
          city: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
          postalCode: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
          street: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
        }),
        description: ["", [Validators.required, Validators.minLength(10)]],
        logoUrl: ["", [Validators.required, Validators.pattern('https?://.+')]], // Basic URL validation
        policies: this.formBuilder.group({
          shipping: ["", [Validators.required, Validators.minLength(10)]],
          returns: ["", [Validators.required, Validators.minLength(10)]]
        }),
        location: this.formBuilder.group({
          type: ["Point", [Validators.required]], // Assuming GeoJSON Point type
          coordinates: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)]], // Latitude, Longitude format
        }),
        status: ["pending", [Validators.required]],
      })

      this.currentId = this.active.snapshot.paramMap.get("id") || '';
      // If currentId is present, fetch the store data by ID
      console.log("Current ID:", this.currentId);
      // Fetch store data by ID if currentId is available
      if (this.currentId) {
        this.storeService.getStoreById(this.currentId).subscribe({
          next: (res) => {
            this.storeDataForm.patchValue(res.data.store);
          },
          error: (err) => {
            console.error('Error fetching store data:', err);
          }
        });
      }
    }

    get name() {
      return this.storeDataForm.get("name") as FormControl;
    }

    get description() {
      return this.storeDataForm.get("description") as FormControl;
    }

    get logoUrl() {
      return this.storeDataForm.get("logoUrl") as FormControl;
    }

    get location() {
      return this.storeDataForm.get("location") as FormControl;
    }

    get status() {
      return this.storeDataForm.get("status") as FormControl;
    }

    // Access sub-controls
    get addressGroup() {
      return this.storeDataForm.get("address") as FormGroup;
    }
    get city() {
      return this.storeDataForm.get("address.city") as FormControl;
    }
    get postalCode() {
      return this.storeDataForm.get("address.postalCode") as FormControl;
    }
    get street() {
      return this.storeDataForm.get("address.street") as FormControl;
    }

    get policiesGroup() {
      return this.storeDataForm.get("policies") as FormGroup;
    }
    get shipping() {
      return this.storeDataForm.get("policies.shipping") as FormControl;
    }
    get returns() {
      return this.storeDataForm.get("policies.returns") as FormControl;
    }

    // Method to submit the form
    onSubmit() {
      if (this.storeDataForm.valid) {
        console.log('Form Submitted:', this.storeDataForm.value);
        // Here you would typically call a service to save the data
        // For example: this.storeService.addStore(this.storeDataForm.value).subscribe(response =>
        this.storeService.updateStore( this.currentId, this.storeDataForm.value ).subscribe({
          next: (response) => {
            console.log('Store updated successfully:', response);
            // Optionally reset the form or navigate to another page
            this.storeDataForm.reset();
            this.router.navigate(['/store']); // Navigate to the stores list or another page
          },
          error: (error) => {
            console.error('Error adding store:', error);
          }
        });
      } else {
        console.log('Form is invalid');
      }
    }
    // Method to get the current location and set it in the form control
    getCurrentLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          // Update the form control
          this.storeDataForm.get('location')?.setValue({
            type: "Point",
            coordinates: [lng, lat]
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Permission denied. Please allow location access.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get your location timed out.');
              break;
            default:
              alert('An unknown error occurred.');
              break;
          }
        }
      );
    }

}
