
export function buildContextValue(base: any, slaCosts: any) {
  return {
    ...base,
    slaCosts
    // ev. fler framtida extrafält här
  };
}
