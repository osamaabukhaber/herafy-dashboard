import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentManagementComponent } from './payments-main-component';

describe('AdminPaymentManagementComponent', () => {
  let component: AdminPaymentManagementComponent;
  let fixture: ComponentFixture<AdminPaymentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPaymentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPaymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
