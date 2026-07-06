import { Component, ElementRef, input, output, viewChildren } from '@angular/core';

export interface TabItem<T extends string = string> {
  readonly id: T;
  readonly label: string;
}

/**
 * Tab-Leiste mit korrekter ARIA-Semantik (tablist/tab/aria-selected) und
 * Tastaturbedienung (Pfeiltasten, Home/End, roving tabindex). Aktiver Tab
 * wird über Unterstreichung + Schriftgewicht signalisiert, nicht nur Farbe.
 */
@Component({
  selector: 'home-tab-bar',
  template: `
    <div class="tab-bar" role="tablist" [attr.aria-label]="ariaLabel() || null">
      @for (tab of tabs(); track tab.id) {
        <button
          #tabButton
          type="button"
          role="tab"
          class="tab"
          [class.tab--active]="tab.id === activeId()"
          [attr.aria-selected]="tab.id === activeId()"
          [attr.data-label]="tab.label"
          [tabindex]="tab.id === activeId() ? 0 : -1"
          (click)="select(tab.id)"
          (keydown)="onKeydown($event, $index)">
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .tab-bar {
      display: flex;
      gap: var(--app-space-1);
      overflow-x: auto;
      border-bottom: 1px solid var(--app-border);
    }

    .tab {
      padding: var(--app-space-2) var(--app-space-3);
      margin-bottom: -1px;
      font: inherit;
      color: var(--app-text-muted);
      white-space: nowrap;
      cursor: pointer;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;

      &:hover {
        color: var(--app-text);
        background: var(--app-surface-muted);
      }

      // Breite des fetten Zustands vorreservieren, damit der aktive
      // Tab das Layout nicht verschiebt.
      &::after {
        display: block;
        height: 0;
        overflow: hidden;
        font-weight: 600;
        visibility: hidden;
        content: attr(data-label);
      }
    }

    .tab--active {
      font-weight: 600;
      color: var(--app-primary-strong);
      border-bottom-color: var(--app-primary);
    }
  `,
})
export class TabBarComponent<T extends string = string> {
  readonly tabs = input.required<TabItem<T>[]>();
  readonly activeId = input.required<T>();
  readonly ariaLabel = input('');

  readonly activeIdChange = output<T>();

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected select(id: T): void {
    if (id !== this.activeId()) {
      this.activeIdChange.emit(id);
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs();
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(tabs[nextIndex].id);
    this.tabButtons()[nextIndex]?.nativeElement.focus();
  }
}
