import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreServices } from '../../services/store-serivces/store-services';
import { LucideAngularModule, Building, Info, MapPin, Palette, FileText, BarChart, AlertCircle, Clock, Plus, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-store-added-newstore-component',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './store-added-newstore-component.html',
  styleUrl: './store-added-newstore-component.css'
})
export class StoreAddedNewstoreComponent implements OnInit {

  storeDataForm!: FormGroup;
  statusOptions: string[] = [];
  selectedLogoFile: File | null = null;
  logoPreview: string | null = null;

  // Icon imports for template use
  readonly Building = Building;
  readonly Info = Info;
  readonly MapPin = MapPin;
  readonly Palette = Palette;
  readonly FileText = FileText;
  readonly BarChart = BarChart;
  readonly AlertCircle = AlertCircle;
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly ChevronRight = ChevronRight;

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreServices,
    private router: Router
  ) {
    this.statusOptions = ['pending', 'approved', 'rejected', 'suspended'];
  }

  ngOnInit(): void {
    this.storeDataForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: this.formBuilder.group({
        city: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        postalCode: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
        street: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
      }),
      description: ["", [Validators.required, Validators.minLength(10)]],
      logoUrl: ["", [Validators.required]],
      policies: this.formBuilder.group({
        shipping: ["", [Validators.required, Validators.minLength(10)]],
        returns: ["", [Validators.required, Validators.minLength(10)]]
      }),
      location: this.formBuilder.group({
        type: ["Point", [Validators.required]],
        coordinates: ["", [Validators.pattern(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)]],
      }),
      status: ["pending", [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
      this.storeDataForm.patchValue({ logoUrl: this.selectedLogoFile.name });

      const reader = new FileReader();
      reader.onload = (e) => this.logoPreview = e.target?.result as string;
      reader.readAsDataURL(this.selectedLogoFile);
    }
  }

  get name() { return this.storeDataForm.get("name") as FormControl; }
  get description() { return this.storeDataForm.get("description") as FormControl; }
  get logoUrl() { return this.storeDataForm.get("logoUrl") as FormControl; }
  get location() { return this.storeDataForm.get("location") as FormControl; }
  get status() { return this.storeDataForm.get("status") as FormControl; }

  get addressGroup() { return this.storeDataForm.get("address") as FormGroup; }
  get city() { return this.storeDataForm.get("address.city") as FormControl; }
  get postalCode() { return this.storeDataForm.get("address.postalCode") as FormControl; }
  get street() { return this.storeDataForm.get("address.street") as FormControl; }

  get policiesGroup() { return this.storeDataForm.get("policies") as FormGroup; }
  get shipping() { return this.storeDataForm.get("policies.shipping") as FormControl; }
  get returns() { return this.storeDataForm.get("policies.returns") as FormControl; }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.storeDataForm.value;

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);

    if (this.selectedLogoFile) {
      formData.append('logoUrl', this.selectedLogoFile, this.selectedLogoFile.name);
    } else {
      formData.append('logoUrl', formValue.logoUrl);
    }

    formData.append('status', formValue.status);

    formData.append('address[city]', formValue.address.city);
    formData.append('address[postalCode]', formValue.address.postalCode);
    formData.append('address[street]', formValue.address.street);

    formData.append('policies[shipping]', formValue.policies.shipping);
    formData.append('policies[returns]', formValue.policies.returns);

    formData.append('location[type]', formValue.location.type);
    if (formValue.location.coordinates && formValue.location.coordinates.trim()) {
      const coordsString = formValue.location.coordinates.trim();
      const coords = coordsString.split(',').map((coord: string) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        formData.append('location[coordinates][0]', coords[1].toString());
        formData.append('location[coordinates][1]', coords[0].toString());
      }
    }

    return formData;
  }

  onSubmit() {
    if (this.storeDataForm.valid) {
      console.log('Form Submitted:', this.storeDataForm.value);
      const formData = this.createFormData();

      console.log('FormData contents:');
      formData.forEach((value, key) => console.log(key, value));

      this.storeService.addStore(formData).subscribe({
        next: (response) => {
          console.log('Store added successfully:', response);
          this.storeDataForm.reset();
          this.selectedLogoFile = null;
          this.logoPreview = null;
          this.router.navigate(['/store']);
        },
        error: (error) => {
          console.error('Error adding store:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

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
        this.storeDataForm.get('location.coordinates')?.setValue(coordinates);
        this.storeDataForm.get('location')?.patchValue({
          type: "Point",
          coordinates: coordinates
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
