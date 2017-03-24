import { PoloTerminalPage } from './app.po';

describe('polo-terminal App', () => {
  let page: PoloTerminalPage;

  beforeEach(() => {
    page = new PoloTerminalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
