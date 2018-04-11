import { OverlayRef } from '@angular/cdk/overlay';

export class MenuOverlayRef {

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}
