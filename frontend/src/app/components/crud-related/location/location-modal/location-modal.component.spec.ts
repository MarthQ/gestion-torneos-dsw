import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationModalComponent } from './location-modal.component';

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationModalComponent]
    });
    fixture = TestBed.createComponent(LocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
