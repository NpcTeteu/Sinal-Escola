import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Relogio } from './relogio';

describe('Relogio', () => {
  let component: Relogio;
  let fixture: ComponentFixture<Relogio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Relogio],
    }).compileComponents();

    fixture = TestBed.createComponent(Relogio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
