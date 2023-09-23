* `Y = floor (X)`

Return the largest integer not greater than `X`.

This is equivalent to rounding towards negative infinity.  If `X` is
complex, return %%floor (real (X)) + floor (imag (X)) * I%%.

>> `floor ([-2.7, 2.7])`

>> %%floor ([-2.7, 2.7]) = [-3, 2]%%

See also: `ceil`, `round`, `fix`.
