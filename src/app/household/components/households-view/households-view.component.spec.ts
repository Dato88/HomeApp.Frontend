import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HouseholdsViewComponent } from './households-view.component';

describe('HouseholdsViewComponent', () => {
  let component: HouseholdsViewComponent;
  let fixture: ComponentFixture<HouseholdsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdsViewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
