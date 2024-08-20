import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeModalComponent } from './game-type-modal.component';

describe('GameTypeModalComponent', () => {
  let component: GameTypeModalComponent;
  let fixture: ComponentFixture<GameTypeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameTypeModalComponent]
    });
    fixture = TestBed.createComponent(GameTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
