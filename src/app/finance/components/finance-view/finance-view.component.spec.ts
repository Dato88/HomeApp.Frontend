import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FinanceViewComponent } from './finance-view.component';

describe('FinanceViewComponent', () => {
  let component: FinanceViewComponent;
  let fixture: ComponentFixture<FinanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceViewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
