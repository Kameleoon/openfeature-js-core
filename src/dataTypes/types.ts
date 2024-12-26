/**
 * CustomDataType is used to add `CustomData` using `EvaluationContext`.
 */
export enum CustomDataType {
  INDEX = 'index',
  VALUES = 'values',
}

/**
 * ConversionType is used to add `Conversion` using `EvaluationContext`.
 */
export enum ConversionType {
  GOAL_ID = 'goalId',
  REVENUE = 'revenue',
}

export type ConversionValue = {
  [ConversionType.GOAL_ID]: number;
  [ConversionType.REVENUE]: number;
};

export type CustomDataValue = {
  [CustomDataType.INDEX]: number;
  [CustomDataType.VALUES]: string[];
};

export type MakeConversionParameters = {
  goalId: number;
  revenue?: number;
};
