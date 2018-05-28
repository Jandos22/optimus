import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error) {
    console.log(error);
    // throw error;
  }
}
