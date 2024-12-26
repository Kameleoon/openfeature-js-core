import { Conversion, CustomData } from '@kameleoon/javascript-sdk-core';
import { ConversionType, CustomDataType } from 'src/dataTypes/types';
import {
  EvaluationContext,
  EvaluationContextValue,
  JsonValue,
} from '@openfeature/core';
import { DataConverter } from 'src/dataConverter';
import { DataType } from 'src/dataTypes';

describe('DataConverter', () => {
  test('convert null context', () => {
    const context: EvaluationContext | null = null;

    const result = DataConverter.toKameleoon(context);

    expect(result).toEqual([]);
  });

  test.each`
    description          | addRevenue
    ${'with revenue'}    | ${true}
    ${'without revenue'} | ${false}
    `(`convert context to data, with conversion $description`,
    (addRevenue) => {
      const rnd = Math.random;
      const expectedGoalId = Math.floor(rnd() * 1000);
      const expectedRevenue = rnd() * 1000;
      const conversionDictionary: { [key: string]: EvaluationContextValue } = {
        [ConversionType.GOAL_ID]: expectedGoalId,
      };

      if (addRevenue) {
        conversionDictionary[ConversionType.REVENUE] = expectedRevenue;
      }

      const context: EvaluationContext = {
        [DataType.CONVERSION]: conversionDictionary,
      };

      const result = DataConverter.toKameleoon(context);

      expect(result.length).toBe(1);
      const conversion = result[0] as Conversion;
      expect(conversion).toMatchObject({
        goalId: expectedGoalId,
        negative: false,
        revenue: addRevenue ? expectedRevenue : 0,
      });
    },
  );

  test.each`
  expectedValues
  ${[]}
  ${['']}
  ${['v1']}
  ${['v1', 'v1']}
  ${['v1', 'v2', 'v3']}
  `('convert context to data, with custom data with values $expectedValues',
    ({ expectedValues }) => {
      // Arrange
      const expectedIndex = Math.floor(Math.random() * 1000);
      const customDataDictionary: { [key: string]: EvaluationContextValue } = {
        [CustomDataType.INDEX]: expectedIndex,
      };

      if (expectedValues.length === 1) {
        customDataDictionary[CustomDataType.VALUES] = expectedValues[0];
      } else if (expectedValues.length > 1) {
        customDataDictionary[CustomDataType.VALUES] = expectedValues;
      }

      const context: EvaluationContext = {
        [DataType.CUSTOM_DATA]: customDataDictionary,
      };

      // Act
      const result = DataConverter.toKameleoon(context);

      // Assert
      expect(result.length).toBe(1);
      const customData = result[0] as CustomData;
      expect(customData).toMatchObject({
        index: expectedIndex,
        value: expectedValues,
      });
    },
  );

  test('convert context to data, with different data', () => {
    // Arrange
    const rnd = Math.random;
    const goalId1 = Math.floor(rnd() * 1000);
    const goalId2 = Math.floor(rnd() * 1000);
    const index1 = Math.floor(rnd() * 1000);
    const index2 = Math.floor(rnd() * 1000);

    const allDataDictionary: { [key: string]: EvaluationContextValue } = {
      [DataType.CONVERSION]: [
        { [ConversionType.GOAL_ID]: goalId1 },
        { [ConversionType.GOAL_ID]: goalId2 },
      ],
      [DataType.CUSTOM_DATA]: [
        { [CustomDataType.INDEX]: index1 },
        { [CustomDataType.INDEX]: index2 },
      ],
    };

    const context: EvaluationContext = {
      ...allDataDictionary,
    };

    // Act
    const result = DataConverter.toKameleoon(context);

    // Assert
    expect(result.length).toBe(4);
    const conversions = result.filter(
      (data) => data instanceof Conversion,
    ) as Conversion[];
    expect(conversions[0]).toMatchObject({
      goalId: goalId1,
      revenue: 0,
      negative: false,
    });
    expect(conversions[1]).toMatchObject({
      goalId: goalId2,
      revenue: 0,
      negative: false,
    });
    const customData = result.filter(
      (data) => data instanceof CustomData,
    ) as CustomData[];
    expect(customData[0]).toMatchObject({
      index: index1,
    });
    expect(customData[1]).toMatchObject({
      index: index2,
    });
  });
});
