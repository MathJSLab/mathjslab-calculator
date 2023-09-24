* `TF = or (X, Y)`
* `TF = or (X1, X2, ...)`

Return the logical **OR** of `X` and `Y`.

This function is equivalent to the operator syntax `X | Y`.  If
more than two arguments are given, the logical **OR** is applied
cumulatively from left to right:

>> `(...((X1 | X2) | X3) | ...)`

See also: `and`, `not`, `xor`.
