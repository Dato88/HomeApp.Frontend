import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentUrlService {
  public urlAdress: string = environment.urlAddress;
  constructor() {}
}
