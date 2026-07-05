import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([])), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load todos from the BFF API path', () => {
    service.getAllTodos().subscribe();

    const req = httpTesting.expectOne('/api/todo/todos');
    expect(req.request.method).toBe('GET');
    req.flush({ isSuccess: true, value: [] });
  });
});
