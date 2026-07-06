import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Fails on serious/critical axe violations for the current page. */
export async function checkA11y(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical'
  );

  expect(violations, formatViolations(violations)).toEqual([]);
}

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']
): string {
  return violations
    .map((violation) => `${violation.id}: ${violation.help} (${violation.impact})`)
    .join('\n');
}

/** Page-level horizontal overflow check; `.grid-scroll` may scroll internally. */
export async function assertNoPageOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() => {
    const tolerance = 1;
    return document.documentElement.scrollWidth > window.innerWidth + tolerance;
  });

  expect(hasOverflow).toBe(false);
}
