import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDTableComponent } from './crud-table.component';

describe('CRUDTableComponent', () => {
  let component: CRUDTableComponent;
  let fixture: ComponentFixture<CRUDTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CRUDTableComponent]
    });
    fixture = TestBed.createComponent(CRUDTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
