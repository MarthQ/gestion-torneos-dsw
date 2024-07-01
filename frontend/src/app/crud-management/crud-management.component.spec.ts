import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDManagementComponent } from './crud-management.component';

describe('CRUDManagementComponent', () => {
  let component: CRUDManagementComponent;
  let fixture: ComponentFixture<CRUDManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CRUDManagementComponent]
    });
    fixture = TestBed.createComponent(CRUDManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
