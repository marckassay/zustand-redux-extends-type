type EventName = Record<string, unknown>;
type FeatureEventMap = Record<string, EventName>;
type Separator = "/";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ActionsIndex<
  Type extends FeatureEventMap,
  FeatureKey extends keyof Type = ""
> = FeatureKey extends keyof Type
  ? {
      [EventKey in keyof Type[FeatureKey] as `${string &
        FeatureKey}${Separator}${string &
        EventKey}`]: Type[FeatureKey][EventKey];
    }
  : ActionsIndex<Type, keyof Type>;

type ActionsIntersect<Type extends FeatureEventMap> = UnionToIntersection<
  ActionsIndex<Type>
>;

type PayloadOptionalIfUndefined<A> = A extends {
  type: infer T;
  payload: undefined;
}
  ? { type: T; payload?: undefined }
  : A;

// Credit given [here](https://stackoverflow.com/questions/73792053/typescript-argument-type-from-a-previous-argument-value).
type ReduxAction<Type extends FeatureEventMap> = {
  [FeatureEvent in keyof ActionsIntersect<Type>]: {
    type: FeatureEvent;
    payload: ActionsIntersect<Type>[FeatureEvent];
  };
}[keyof ActionsIntersect<Type>];

export type ReduxExtends<T extends FeatureEventMap> = PayloadOptionalIfUndefined<
  ReduxAction<T>
>;
