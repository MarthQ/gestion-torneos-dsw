import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionModalComponent } from './inscription-modal.component';

describe('InscriptionModalComponent', () => {
  let component: InscriptionModalComponent;
  let fixture: ComponentFixture<InscriptionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionModalComponent]
    });
    fixture = TestBed.createComponent(InscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
