import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds toasts with their type and message', () => {
    service.success('Gespeichert');
    service.error('Fehlgeschlagen');

    const toasts = service.toasts();
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toMatchObject({ type: 'success', message: 'Gespeichert' });
    expect(toasts[1]).toMatchObject({ type: 'error', message: 'Fehlgeschlagen' });
  });

  it('auto-dismisses success toasts after 5s and error toasts after 8s', () => {
    service.success('Gespeichert');
    service.error('Fehlgeschlagen');

    vi.advanceTimersByTime(5000);
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].type).toBe('error');

    vi.advanceTimersByTime(3000);
    expect(service.toasts()).toHaveLength(0);
  });

  it('keeps at most 3 toasts and drops the oldest', () => {
    service.info('eins');
    service.info('zwei');
    service.info('drei');
    service.info('vier');

    const messages = service.toasts().map(toast => toast.message);
    expect(messages).toEqual(['zwei', 'drei', 'vier']);
  });

  it('dismisses a toast by id', () => {
    service.info('eins');
    service.info('zwei');

    service.dismiss(service.toasts()[0].id);

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].message).toBe('zwei');
  });
});
