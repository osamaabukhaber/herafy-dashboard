import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddedNewstoreComponent } from './store-added-newstore-component';

describe('StoreAddedNewstoreComponent', () => {
  let component: StoreAddedNewstoreComponent;
  let fixture: ComponentFixture<StoreAddedNewstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAddedNewstoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreAddedNewstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
