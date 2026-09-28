import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Musicas } from './musicas';

describe('Musicas', () => {
  let component: Musicas;
  let fixture: ComponentFixture<Musicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Musicas],
    }).compileComponents();

    fixture = TestBed.createComponent(Musicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
