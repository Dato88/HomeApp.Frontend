/** Entspricht DropdownData aus homeapp-lib (Showcase / CodingLab). */
export interface DropdownData {
  trackBy: number;
  value: string;
  name: string;
  selected?: boolean;
}

/** lib-grid Standard-rowHeight (38px) ist zu niedrig für Dropdowns mit height: 3rem. */
export const GRID_ROW_HEIGHT_WITH_DROPDOWN = 72;
