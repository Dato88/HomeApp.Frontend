import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

/**
 * Gestylter Datei-Upload: Button-artiges Label mit verstecktem
 * <input type="file">, Anzeige des gewählten Dateinamens und Entfernen-Knopf.
 */
@Component({
  selector: 'home-file-upload',
  template: `
    <div class="file-upload">
      <label class="btn file-upload-trigger">
        <i class="bi bi-upload" aria-hidden="true"></i>
        <span>{{ label() }}</span>
        <input
          #fileInput
          type="file"
          class="file-upload-input"
          [accept]="accept() || null"
          (change)="onFileChange($event)" />
      </label>
      @if (fileName()) {
        <span class="file-upload-name">{{ fileName() }}</span>
        <button
          type="button"
          class="icon-button"
          aria-label="Dateiauswahl entfernen"
          (click)="clear()">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      }
    </div>
  `,
  styles: `
    .file-upload {
      display: inline-flex;
      flex-wrap: wrap;
      gap: var(--app-space-2);
      align-items: center;
    }

    .file-upload-trigger {
      position: relative;

      &:has(.file-upload-input:focus-visible) {
        outline: var(--app-focus-ring);
        outline-offset: 2px;
      }
    }

    .file-upload-input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      opacity: 0;
    }

    .file-upload-name {
      max-width: 24ch;
      overflow: hidden;
      font-size: var(--app-text-sm);
      color: var(--app-text-muted);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
})
export class FileUploadComponent {
  readonly label = input('Datei auswählen');
  readonly accept = input('');

  readonly fileSelected = output<File | undefined>();

  protected readonly fileName = signal('');

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileName.set(file?.name ?? '');
    this.fileSelected.emit(file);
  }

  clear(): void {
    this.fileInput().nativeElement.value = '';
    this.fileName.set('');
    this.fileSelected.emit(undefined);
  }
}
