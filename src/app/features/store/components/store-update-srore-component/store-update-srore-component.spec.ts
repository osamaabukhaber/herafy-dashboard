import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUpdateSroreComponent } from './store-update-srore-component';

describe('StoreUpdateSroreComponent', () => {
  let component: StoreUpdateSroreComponent;
  let fixture: ComponentFixture<StoreUpdateSroreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreUpdateSroreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreUpdateSroreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
