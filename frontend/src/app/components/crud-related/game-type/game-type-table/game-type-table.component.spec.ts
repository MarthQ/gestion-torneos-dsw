import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeTableComponent } from './game-type-table.component';

describe('GameTypeTableComponent', () => {
  let component: GameTypeTableComponent;
  let fixture: ComponentFixture<GameTypeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameTypeTableComponent]
    });
    fixture = TestBed.createComponent(GameTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
