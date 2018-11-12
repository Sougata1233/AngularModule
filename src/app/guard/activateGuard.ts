import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { sessionServices } from '../services/session.services';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(public session: sessionServices) {}

  canActivate() {
    return this.session.isLoggedIn();
  }
}