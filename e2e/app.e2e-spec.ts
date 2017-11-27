import { MusiclynxNgPage } from './app.po';

describe('musiclynx-ng App', function() {
  let page: MusiclynxNgPage;

  beforeEach(() => {
    page = new MusiclynxNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
