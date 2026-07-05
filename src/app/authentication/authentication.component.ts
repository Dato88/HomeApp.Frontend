import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '../core/auth/auth-store';

@Component({
  selector: 'home-authentication',
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (!this.authStore.authStatusResource.hasValue()) {
        return;
      }

      if (this.authStore.isAuthenticated()) {
        void this.#router.navigate(['/dashboard']);
        return;
      }

      if (this.#route.snapshot.queryParamMap.get('action') !== 'logout') {
        this.authStore.login();
      }
    });
  }

  public ngOnInit(): void {
    if (this.#route.snapshot.queryParamMap.get('action') === 'logout') {
      this.authStore.logout();
    }
  }

  protected isLogoutAction(): boolean {
    return this.#route.snapshot.queryParamMap.get('action') === 'logout';
  }
}
