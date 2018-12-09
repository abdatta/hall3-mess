import { MainNavModule } from './main-nav.module';

describe('MainNavModule', () => {
  let mainNavModule: MainNavModule;

  beforeEach(() => {
    mainNavModule = new MainNavModule();
  });

  it('should create an instance', () => {
    expect(mainNavModule).toBeTruthy();
  });
});
