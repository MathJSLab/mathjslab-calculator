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
E = [A,C] % A 4x3 matrix.
E+A % error: Incompatible sizes.
E+B % error: Incompatible sizes.
E+C % Compatible sizes. Two inputs which are exactly the same size.
% Broadcasting rules for multidimensional arrays.
A = [1,2,3;4,5,6;7,8,9;10,11,12]
A(:,:,2) = A(:,:,1) + 3
A(:,:,3) = A(:,:,1) + 5
A(:,:,4) = A(:,:,1) + 7
A(:,:,5) = A(:,:,1) + 9
A(:,:,:,2) = A(:,:,:,1) * 4
A
B = A(:,:,3:end,1)
A+B % error
B = A(:,:,1,1)
A+B
B = A(:,2,1,1)
A+B
B = A(2,:,1,1)
A+B
B = A(2,:,:,:)
A+B
B = A(:,2,:,:)
A+B
B = A(:,:,2,:)
A+B
B = A(:,:,:,2)
A+B
% multidimensional broadcasting
A = [1,2,3,4;5,6,7,8;9,10,11,12;13,14,15,16;17,18,19,20]
B = A + 20
B(:,:,2) = A + 40
A + B
A + B(1,:,:)
A + B(:,1,:)
A + B(:,:,1)
A + B(1,1,:)
A + B(1,:,1)
A + B(1,1,1)
C = B + 40
C(:,:,:,2) = B + 80
C(:,:,:,3) = B + 120
C = C - 60
size(C)
D = C + C(1,:,:,:)
E = C + C(:,1,:,:)
F = C + C(:,:,1,:)
G = C + C(:,:,:,1)
H = C(1,:,:,:) + C(1,:,:,:)
K = C(1,:,:,:) + C(:,1,:,:)
L = C(1,:,:,:) + C(:,:,1,:)
M = C(1,:,:,:) + C(:,:,:,1)
N = C(:,1,:,:) + C(1,:,:,:)
O = C(:,1,:,:) + C(:,1,:,:)
P = C(:,1,:,:) + C(:,:,1,:)
Q = C(:,1,:,:) + C(:,:,:,1)
R = C(:,:,1,:) + C(1,:,:,:)
S = C(:,:,1,:) + C(:,1,:,:)
T = C(:,:,1,:) + C(:,:,1,:)
U = C(:,:,1,:) + C(:,:,:,1)
V = C(:,:,:,1) + C(1,:,:,:)
W = C(:,:,:,1) + C(:,1,:,:)
X = C(:,:,:,1) + C(:,:,1,:)
Y = C(:,:,:,1) + C(:,:,:,1)
C(1,:,1,:) + C(:,1:2,2,2) % error
C + C(:,1,1,1:2) % error
