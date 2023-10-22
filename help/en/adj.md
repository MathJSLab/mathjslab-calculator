* `Y = adj (X)`

Compute the adjugate (adjoint) matrix for a square matrix `X`.

The adjoint matrix is defined as

>> %%adj (X) = cofactor (X)'%%.

For invertible matrix `X` the following relation is valid:

%%%1/det(X)*adj(X) = inv(X)%%%

See also: `inv`, `cofactor`, `ctranspose`.

### References

* https://mathworld.wolfram.com/ConjugateTranspose.html
* https://en.wikipedia.org/wiki/Adjugate_matrix
