import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    fixture.componentRef.setInput('controlName', 'title');
    fixture.componentRef.setInput('identifier', 'test');
    fixture.componentRef.setInput('label', 'Title');
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
