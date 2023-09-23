* `TF = and (X, Y)`
* `TF = and (X1, X2, ...)`

Return the logical **AND** of `X` and `Y`.

This function is equivalent to the operator syntax `X & Y`.  If
more than two arguments are given, the logical **AND** is applied
cumulatively from left to right:

`(...((X1 & X2) & X3) & ...)`

See also: `or`, `not`, `xor`.
