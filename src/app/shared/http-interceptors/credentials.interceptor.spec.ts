import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { credentialsInterceptor } from './credentials.interceptor';

describe('credentialsInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should set withCredentials for BFF API requests', () => {
    http.get('/api/person/person').subscribe();

    const req = httpTesting.expectOne('/api/person/person');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should not modify unrelated requests', () => {
    http.get('https://example.org/data').subscribe();

    const req = httpTesting.expectOne('https://example.org/data');
    expect(req.request.withCredentials).toBe(false);
    req.flush({});
  });
});
