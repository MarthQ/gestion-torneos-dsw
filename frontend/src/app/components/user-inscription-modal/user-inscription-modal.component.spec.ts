import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInscriptionModalComponent } from './user-inscription-modal.component';

describe('UserInscriptionModalComponent', () => {
  let component: UserInscriptionModalComponent;
  let fixture: ComponentFixture<UserInscriptionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInscriptionModalComponent]
    });
    fixture = TestBed.createComponent(UserInscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
