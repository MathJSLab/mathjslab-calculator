* `C = times (A, B)`
* `C = times (A1, A2, ...)`

Return the element-by-element multiplication product of inputs.

This function and `A .* B` are equivalent.  If more arguments are
given, the multiplication is applied cumulatively from left to
right:

>> `(...((A1 .* A2) .* A3) .* ...)`

See also: `mtimes`, `rdivide`.
