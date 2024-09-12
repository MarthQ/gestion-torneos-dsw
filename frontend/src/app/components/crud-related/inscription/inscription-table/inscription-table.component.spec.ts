import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionTableComponent } from './inscription-table.component';

describe('InscriptionTableComponent', () => {
  let component: InscriptionTableComponent;
  let fixture: ComponentFixture<InscriptionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionTableComponent]
    });
    fixture = TestBed.createComponent(InscriptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
