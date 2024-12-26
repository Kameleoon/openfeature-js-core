import {
  Conversion,
  CustomData,
  KameleoonDataType,
} from '@kameleoon/javascript-sdk-core';
import { ConversionType, CustomDataType } from 'src/dataTypes/types';
import { EvaluationContext, EvaluationContextValue } from '@openfeature/core';
import { DataType } from './dataTypes';
import { DataContext } from 'src/types';

/**
 * DataConverter is used to convert a data from OpenFeature to Kameleoon.
 */
export class DataConverter {
  /**
   * Dictionary which contains conversion methods by keys
   */
  private static readonly conversionMethods: {
    [key: string]: (value: DataContext) => KameleoonDataType;
  } = {
    [DataType.CONVERSION]: DataConverter.makeConversion,
    [DataType.CUSTOM_DATA]: DataConverter.makeCustomData,
  };

  /**
   * @method toKameleoon - Converts an `EvaluationContext` to Kameleoon data.
   *
   * @param {EvaluationContext | null} context - The context to be converted.
   * @returns {KameleoonDataType[]} The converted Kameleoon data.
   */
  public static toKameleoon(
    context?: EvaluationContext | null,
  ): KameleoonDataType[] {
    if (!context) {
      return [];
    }

    const data: KameleoonDataType[] = [];
    for (const [key, value] of Object.entries(context)) {
      const values = Array.isArray(value) ? value : [value];
      const conversionMethod = DataConverter.conversionMethods[key];
      if (conversionMethod && values) {
        for (const val of values) {
          if (!DataConverter.isEvaluationContext(val)) {
            continue;
          }
          data.push(conversionMethod(val));
        }
      }
    }
    return data;
  }

  /**
   * @method makeCustomData - Converts an `EvaluationContextValue` to a Kameleoon `CustomData` object.
   *
   * @param {DataContext} value - The value to be converted.
   * @returns {CustomData} The converted `CustomData` object.
   * @private
   */
  private static makeCustomData(value: DataContext): CustomData {
    const index = DataConverter.makeCustomDataIndex(value);
    const customDataValues = DataConverter.makeCustomDataValues(value);

    return new CustomData(index, ...customDataValues);
  }

  private static makeCustomDataIndex(
    structCustomData: DataContext,
  ): number {
    const indexValue = structCustomData[CustomDataType.INDEX];
    return typeof indexValue === 'number' ? indexValue : 0;
  }

  private static makeCustomDataValues(
    structCustomData: DataContext,
  ): string[] {
    const dataValues = structCustomData[CustomDataType.VALUES];
    const values = Array.isArray(dataValues) ? dataValues : [dataValues];

    return values.filter((val) => typeof val === 'string') as string[];
  }

  /**
   * @method makeConversion - Converts an `EvaluationContextValue` to a Kameleoon `Conversion` object.
   *
   * @param {DataContext} value - The value to be converted.
   * @returns {Conversion} The converted `Conversion` object.
   * @private
   */
  private static makeConversion(value: DataContext): Conversion {
    const goalId = DataConverter.makeConversionGoalId(value);
    const revenue = DataConverter.makeConversionRevenue(value);

    return new Conversion({
      goalId,
      revenue,
      negative: false,
    });
  }

  private static makeConversionGoalId(
    structConversion: DataContext,
  ): number {
    const goalIdValue = structConversion[ConversionType.GOAL_ID];
    return goalIdValue !== null && typeof goalIdValue === 'number'
      ? goalIdValue
      : 0;
  }

  private static makeConversionRevenue(
    structConversion: DataContext,
  ): number {
    const revenueValue = structConversion[ConversionType.REVENUE];
    return revenueValue !== null && typeof revenueValue === 'number'
      ? revenueValue
      : 0.0;
  }

  private static isEvaluationContext(
    value: EvaluationContextValue,
  ): value is DataContext {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
