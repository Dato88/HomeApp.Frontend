import { Pipe, PipeTransform } from '@angular/core';

/** Gruppiert eine IBAN in 4er-Blöcke, z. B. "DE89370400440532013000" -> "DE89 3704 0044 0532 0130 00". */
export function formatIban(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const normalized = value.replace(/\s+/g, '').toUpperCase();
  return (normalized.match(/.{1,4}/g) ?? []).join(' ');
}

@Pipe({ name: 'ibanFormat' })
export class IbanFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return formatIban(value);
  }
}
