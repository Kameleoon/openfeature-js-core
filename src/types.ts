import {
  EvaluationContext,
  EvaluationContextValue,
  ResolutionDetails,
} from '@openfeature/core';

/**
 * Resolver interface which contains method for evaluations based on provided data
 */
export interface Resolver {
  /**
   * Main method for getting resolution details based on provided data.
   */
  resolve<T>({
    flagKey,
    defaultValue,
    context,
    isAnyType,
  }: ResolveParams<T>): ResolutionDetails<T>;
}

export type ResolveParams<T> = {
  flagKey: string;
  defaultValue: T;
  context: EvaluationContext;
  isAnyType?: boolean;
};

export type DataContext = { [key: string]: EvaluationContextValue };
