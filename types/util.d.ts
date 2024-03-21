type DeepNonNullable<T> = {
  [K in keyof T]: NonNullable<T[K]> extends object
    ? DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>
}
