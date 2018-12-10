import { DishPickerModule } from './dish-picker.module';

describe('DishPickerModule', () => {
  let dishPickerModule: DishPickerModule;

  beforeEach(() => {
    dishPickerModule = new DishPickerModule();
  });

  it('should create an instance', () => {
    expect(dishPickerModule).toBeTruthy();
  });
});
