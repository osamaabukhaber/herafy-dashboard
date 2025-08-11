import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCartUpdateComponent } from './cart-update-component';

describe('AdminCartUpdateComponent', () => {
  let component: AdminCartUpdateComponent;
  let fixture: ComponentFixture<AdminCartUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCartUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCartUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
