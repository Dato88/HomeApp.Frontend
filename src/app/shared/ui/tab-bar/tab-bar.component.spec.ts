import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabBarComponent, TabItem } from './tab-bar.component';

const TABS: TabItem[] = [
  { id: 'accounts', label: 'Konten' },
  { id: 'transactions', label: 'Buchungen' },
  { id: 'categories', label: 'Kategorien' },
];

describe('TabBarComponent', () => {
  let component: TabBarComponent;
  let fixture: ComponentFixture<TabBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', TABS);
    fixture.componentRef.setInput('activeId', 'accounts');
    fixture.detectChanges();
  });

  function tabButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  it('renders a tablist with aria-selected and roving tabindex', () => {
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();

    const buttons = tabButtons();
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].tabIndex).toBe(0);
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].tabIndex).toBe(-1);
  });

  it('emits activeIdChange on click', () => {
    const changed = vi.fn();
    component.activeIdChange.subscribe(changed);

    tabButtons()[1].click();

    expect(changed).toHaveBeenCalledExactlyOnceWith('transactions');
  });

  it('does not emit when the active tab is clicked again', () => {
    const changed = vi.fn();
    component.activeIdChange.subscribe(changed);

    tabButtons()[0].click();

    expect(changed).not.toHaveBeenCalled();
  });

  it('selects the next tab and moves focus on ArrowRight', () => {
    const changed = vi.fn();
    component.activeIdChange.subscribe(changed);

    tabButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(changed).toHaveBeenCalledExactlyOnceWith('transactions');
    expect(document.activeElement).toBe(tabButtons()[1]);
  });

  it('wraps to the last tab on ArrowLeft from the first tab', () => {
    const changed = vi.fn();
    component.activeIdChange.subscribe(changed);

    tabButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(changed).toHaveBeenCalledExactlyOnceWith('categories');
  });

  it('jumps to first/last tab on Home/End', () => {
    fixture.componentRef.setInput('activeId', 'transactions');
    fixture.detectChanges();
    const changed = vi.fn();
    component.activeIdChange.subscribe(changed);

    tabButtons()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(changed).toHaveBeenLastCalledWith('categories');

    tabButtons()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(changed).toHaveBeenLastCalledWith('accounts');
  });
});
