import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

// jsdom implementiert showModal()/close() für <dialog> nicht vollständig.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent<number>;
  let fixture: ComponentFixture<ConfirmDialogComponent<number>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent<number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function dialogElement(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
  }

  it('opens and closes the underlying dialog', () => {
    component.open(42);
    fixture.detectChanges();
    expect(dialogElement().open).toBe(true);

    component.close();
    fixture.detectChanges();
    expect(dialogElement().open).toBe(false);
  });

  it('emits the context passed to open() when confirmed', () => {
    const confirmed = vi.fn();
    component.confirmed.subscribe(confirmed);

    component.open(42);
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector('.btn') as HTMLButtonElement;
    confirmButton.click();
    fixture.detectChanges();

    expect(confirmed).toHaveBeenCalledExactlyOnceWith(42);
    expect(dialogElement().open).toBe(false);
  });

  it('does not emit when cancelled', () => {
    const confirmed = vi.fn();
    component.confirmed.subscribe(confirmed);

    component.open(42);
    fixture.detectChanges();
    const cancelButton = fixture.nativeElement.querySelector(
      'lib-button button',
    ) as HTMLButtonElement;
    cancelButton.click();
    fixture.detectChanges();

    expect(confirmed).not.toHaveBeenCalled();
    expect(dialogElement().open).toBe(false);
  });

  it('styles the confirm button as danger by default', () => {
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector('.btn') as HTMLButtonElement;
    expect(confirmButton.classList.contains('btn--danger')).toBe(true);
  });
});
