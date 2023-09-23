* `Y = ceil (X)`

Return the smallest integer not less than `X`.

This is equivalent to rounding towards positive infinity.

If `X` is complex, return `ceil (real (X)) + ceil (imag (X)) * I`.

>> `ceil ([-2.7, 2.7])`

>> %%ceil ([-2.7, 2.7]) = [-2, 3]%%

See also: `floor`, `round`, `fix`.
