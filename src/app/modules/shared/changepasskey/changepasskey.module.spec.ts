import { ChangepasskeyModule } from './changepasskey.module';

describe('ChangepasskeyModule', () => {
  let changepasskeyModule: ChangepasskeyModule;

  beforeEach(() => {
    changepasskeyModule = new ChangepasskeyModule();
  });

  it('should create an instance', () => {
    expect(changepasskeyModule).toBeTruthy();
  });
});
