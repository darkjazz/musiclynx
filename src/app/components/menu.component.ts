import { Component, ViewChild, Injectable, Inject } from '@angular/core';
import { MatSidenav }       from '@angular/material/sidenav';
import { MatButton }        from '@angular/material/button';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal }  from '@angular/cdk/portal';
import { MenuItem }         from '../objects/menuitem';
import { InfoComponent }    from './info.component';
import { DemoComponent }    from './demo.component';
import { LayoutComponent }  from './layout.component';
import { MenuOverlayRef }   from '../objects/overlayref';

interface MenuOverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
}

const ITEMS = [
  { "text": "about", "icon": "info" },
  { "text": "layout", "icon": "group_work" },
  { "text": "demo", "icon": "movie" },
  { "text": "github", "icon": "cloud_download" }
];

const DEFAULT_CONFIG: MenuOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'overlay-panel'
}

@Component({
  selector: 'ml-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
@Injectable()
export class Menu {
  @ViewChild('sidenav') sidenav: MatSidenav;
  // @ViewChild('navbtn') navbtn: MatButton;
  items: MenuItem[];
  graphOn: boolean = true;
  gridOn: boolean = false;
  constructor(private overlay: Overlay) {
    this.items = new Array<MenuItem>();
    ITEMS.forEach(item => {
      this.items.push(item as MenuItem)
    })
  }

  select(text: string) {
    this.close();
    if (text == "github")
      this.gotoGithub();
    else
      this.showOverlay(text);
  }

  open() {
    this.sidenav.open();
  }

  close() {
    this.sidenav.close();
  }

  showOverlay(text) {
    var viewPortal;
    switch(text) {
      case "about":
        viewPortal = new ComponentPortal(InfoComponent);
        break;
      case "layout":
        viewPortal = new ComponentPortal(LayoutComponent);
        break;
      case "demo":
        viewPortal = new ComponentPortal(DemoComponent);
        break;
    }
    const overlayRef = this.createOverlay();
    const dialogRef = new MenuOverlayRef(overlayRef);
    overlayRef.attach(viewPortal);
    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    return dialogRef;
  }

  gotoGithub() {
    window.location.href = "https://github.com/darkjazz/musiclynx/tree/static"
  }

  private createOverlay() {
    const overlayConfig = this.getOverlayConfig(DEFAULT_CONFIG);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: MenuOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

}
