import { MessModule } from './mess.module';

describe('MessModule', () => {
  let messModule: MessModule;

  beforeEach(() => {
    messModule = new MessModule();
  });

  it('should create an instance', () => {
    expect(messModule).toBeTruthy();
  });
});
