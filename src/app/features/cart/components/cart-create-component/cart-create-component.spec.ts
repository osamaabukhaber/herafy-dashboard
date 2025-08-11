import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCartFormComponent } from './cart-create-component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AdminCartFormComponent', () => {
  let component: AdminCartFormComponent;
  let fixture: ComponentFixture<AdminCartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminCartFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
