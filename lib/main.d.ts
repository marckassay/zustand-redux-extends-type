declare type EventName = Record<string, unknown>;
declare type FeatureEventMap = Record<string, EventName>;
declare type Separator = "/";
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type ActionsIndex<Type extends FeatureEventMap, FeatureKey extends keyof Type = ""> = FeatureKey extends keyof Type ? {
    [EventKey in keyof Type[FeatureKey] as `${string & FeatureKey}${Separator}${string & EventKey}`]: Type[FeatureKey][EventKey];
} : ActionsIndex<Type, keyof Type>;
declare type ActionsIntersect<Type extends FeatureEventMap> = UnionToIntersection<ActionsIndex<Type>>;
declare type PayloadOptionalIfUndefined<A> = A extends {
    type: infer T;
    payload: undefined;
} ? {
    type: T;
    payload?: undefined;
} : A;
declare type ReduxAction<Type extends FeatureEventMap> = {
    [FeatureEvent in keyof ActionsIntersect<Type>]: {
        type: FeatureEvent;
        payload: ActionsIntersect<Type>[FeatureEvent];
    };
}[keyof ActionsIntersect<Type>];
/**
 * To enforce typings for an `action` parameter of a `reducer` or `dispatch`.
 *
 * By doing so, conditional expressions evalutating the `type` property of `action` type, will have the `payload` type
 * infered in the block scope of condition. Or will have `payload` typed when used in `dispatch`.
 */
export declare type ReduxExtends<T extends FeatureEventMap> = PayloadOptionalIfUndefined<ReduxAction<T>>;
export {};
