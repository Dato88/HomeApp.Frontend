import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { UserStore } from '../+store/user-store';
import { NavbarStore } from '../+store/navbar-store';

describe('AppShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: UserStore,
          useValue: {
            userResource: {
              hasValue: () => false,
              value: () => null,
            },
          },
        },
        {
          provide: NavbarStore,
          useValue: {
            navbarResource: {
              hasValue: () => false,
              value: () => [],
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should render navigation with router outlet', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('lib-navigation')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
