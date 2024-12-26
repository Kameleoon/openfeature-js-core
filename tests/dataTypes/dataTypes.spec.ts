import { ConversionType, CustomDataType, DataType } from 'src/dataTypes';

describe('DataType Tests', () => {
  test('check correct type values', () => {
    expect(DataType.VARIABLE_KEY).toBe('variableKey');
    expect(DataType.CONVERSION).toBe('conversion');
    expect(DataType.CUSTOM_DATA).toBe('customData');

    expect(CustomDataType.INDEX).toBe('index');
    expect(CustomDataType.VALUES).toBe('values');

    expect(ConversionType.GOAL_ID).toBe('goalId');
    expect(ConversionType.REVENUE).toBe('revenue');
  });

  test('check correct makeConversion', () => {
    const goalId = 1;
    const revenue = 2.0;

    const value = DataType.makeConversion({
      goalId,
      revenue,
    });

    expect(value).toEqual({
      [ConversionType.GOAL_ID]: goalId,
      [ConversionType.REVENUE]: revenue,
    });
  });

  test('check correct makeConversion without revenue', () => {
    const goalId = 1;

    const value = DataType.makeConversion({ goalId });

    expect(value).toEqual({
      [ConversionType.GOAL_ID]: goalId,
      [ConversionType.REVENUE]: 0.0,
    });
  });

  test('check correct makeCustomData with single value', () => {
    const id = 1;
    const values = 'b';

    const value = DataType.makeCustomData(id, values);

    expect(value).toEqual({
      [CustomDataType.INDEX]: id,
      [CustomDataType.VALUES]: [values],
    });
  });

  test('check correct makeCustomData with values', () => {
    const id = 1;
    const values = ['a', 'b'];

    const value = DataType.makeCustomData(id, ...values);

    expect(value).toEqual({
      [CustomDataType.INDEX]: id,
      [CustomDataType.VALUES]: values,
    });
  });

  test('check correct makeCustomData without values', () => {
    const id = 1;

    const value = DataType.makeCustomData(id);

    expect(value).toEqual({
      [CustomDataType.INDEX]: id,
      [CustomDataType.VALUES]: [],
    });
  });
});
