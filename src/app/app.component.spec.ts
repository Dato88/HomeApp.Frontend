import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthStore } from './core/auth/auth-store';
import { UserStore } from './+store/user-store';
import { NavbarStore } from './+store/navbar-store';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([{ path: 'authentication', component: AppComponent }]),
        {
          provide: AuthStore,
          useValue: {
            isAuthenticated: () => false,
            authStatusResource: {
              hasValue: () => false,
              isLoading: () => false,
            },
          },
        },
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

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/authentication');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render router outlet without navigation on authentication route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('lib-navigation')).toBeNull();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
