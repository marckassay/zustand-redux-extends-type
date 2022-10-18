# zustand-redux-extends-type

Leveraging typings(`ReduxExtends` and `FeatureEventActions`) as below eliminates the need to use any type assertions in reducers. It also enforces only valid values for properties when `dispatch` is being typed out.

```typescript
import type { ReduxExtends } from "zustand-redux-extends-type";

type FeatureEventActions = {
  grumpiness: {
    increase: number;
    decrease: number;
    reset: undefined;
  };
  happiness: {
    "show all": User[];
    level: "low" | "sort of" | "high";
  };
};

const useGrumpyStore = create(
  redux(
    (
      state: { count: number; level: "low" | "sort of" | "high" },
      { type, payload }: ReduxExtends<FeatureEventActions>
    ) => {
      switch (type) {
        case "grumpiness/increase":
          return { ...state, count: state.count + payload };
        case "grumpiness/decrease":
          return { ...state, count: state.count - payload };
        case "grumpiness/reset":
          return { ...state, count: 0 };
        //removed happiness cases for brevity
        default:
          return state;
      }
    },
    { count: 0, level: "high" }
  )
);

const dispatch = useGrumpyStore((state) => state.dispatch);
dispatch({ type: "grumpiness/decrease", payload: 1 });
```

The structure of this map type, `FeatureEventActions`, is premised on [Redux's recommendation for actions](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#what-youve-learned):

"_The type field should be a readable string, and is usually written as 'feature/eventName'_"

For this example, 'grumpiness' and 'happiness' are features with event names of 'increase' and 'show all' respectively. Each event name is typed for what will be its `payload` type. Any `action` object of `ReduxExtends<FeatureEventActions>`, either as a parameter of `reducer` or `dispatch`, has its `type` property constrained to what will be parsed by TypeScript. This will also dictate the `payload` type.
