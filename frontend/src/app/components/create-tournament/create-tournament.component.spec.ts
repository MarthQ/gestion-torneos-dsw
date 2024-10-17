import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTournamentComponent } from './create-tournament.component';

describe('CreateTournamentComponent', () => {
  let component: CreateTournamentComponent;
  let fixture: ComponentFixture<CreateTournamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTournamentComponent]
    });
    fixture = TestBed.createComponent(CreateTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
