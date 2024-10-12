import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTournamentComponent } from './search-tournament.component';

describe('SearchTournamentComponent', () => {
  let component: SearchTournamentComponent;
  let fixture: ComponentFixture<SearchTournamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTournamentComponent]
    });
    fixture = TestBed.createComponent(SearchTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
