import {
  ConversionType,
  ConversionValue,
  CustomDataType,
  CustomDataValue,
  MakeConversionParameters,
} from 'src/dataTypes/types';

export { ConversionType, CustomDataType };

export class DataType {
  public static readonly VARIABLE_KEY = 'variableKey';
  public static readonly CONVERSION = 'conversion';
  public static readonly CUSTOM_DATA = 'customData';

  /**
   * @method makeConversion - Makes `Value` based on `Conversion` parameters
   *
   * @param {MakeConversionParameters} parameters - an object with parameters of a type `MakeConversionParameters`, see the type for details.
   * @returns {ConversionValue} - a value of a type `ConversionValue`
   */
  public static makeConversion({
    goalId,
    revenue = 0.0,
  }: MakeConversionParameters): ConversionValue {
    return {
      [ConversionType.GOAL_ID]: goalId,
      [ConversionType.REVENUE]: revenue,
    };
  }

  /**
   * @method makeCustomData - Makes `Value` based on `CustomData` parameters
   *
   * @param {number} id - an index of a type `number`
   * @param {string[]} values - an array of values of a type `string`
   * @returns {CustomDataValue} - a value of a type `CustomDataValue`
   */
  public static makeCustomData(id: number, ...values: string[]): CustomDataValue {
    return {
      [CustomDataType.INDEX]: id,
      [CustomDataType.VALUES]: values,
    };
  }
}
