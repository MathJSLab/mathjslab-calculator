* `Y = sind (X)`

Compute the sine for each element of `X` in degrees.

The function is more accurate than `sin` for large values of `X` and
for multiples of 180 degrees (`X/180` is an integer) where `sind`
returns 0 rather than a small value on the order of eps.

See also: `asind`, `sin`.
