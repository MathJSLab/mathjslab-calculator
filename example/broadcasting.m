clear
% Broadcasting rules for 2D arrays.
A = [1,2;3,4;5,6;7,8] % A matrix.
B = [1,2] % A row vector.
C = [1;2;3;4] % A column vector.
D = A+1 % One input is a scalar. Result is a matrix.
A+D % Two inputs which are exactly the same size.
A+B % One input is a matrix, and the other is a row vector.
A+C % One input is a matrix, and the other is a column vector.
B+C % One input is a row vector, and the other is a column vector.
E = [A,C] % A 3x3 matrix.
E+A % error: Incompatible sizes.
E+B % error: Incompatible sizes.
E+C % Compatible sizes. Two inputs which are exactly the same size.
