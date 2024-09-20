import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCrudModalComponent } from './user-crud-modal.component';

describe('UserCrudModalComponent', () => {
  let component: UserCrudModalComponent;
  let fixture: ComponentFixture<UserCrudModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCrudModalComponent]
    });
    fixture = TestBed.createComponent(UserCrudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
