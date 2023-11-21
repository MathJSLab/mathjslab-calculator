% Linear algebra functions and operations.
clear
A = [1,2,0;1,1,0;-1,4,0]
B = [1,2,3;1,1,-1;2,2,2]
C = [1,2,3;1,1,-1;1,1,1]
% Trace
trace(A) % 2
trace(B) % 4
trace(C) % 3
% Transpose
A.'
A'
B.'
B'
% Matrix multiplication
D = A*B
E = A*C
D == E % Even though B is different from C, the product A*B and A*C is the same
% Determinant
clear
A = [1:3;4:6;7:9]
B = [2, 1, -3; 3, 2, 4; 2, 5, -2]
C = [-7,6,3,1; -9,1,6,4; -8,-4,3,6; -5,5,9,2]
D = [1,2,1;0,3,2;0,0,1]
E = [2,1,3,0;5,1,3,2;4,2,5,1;1,2,3,7]
F = [2,1,-3;-1,3,2;3,1,-3]
det(A) % 0
det(B) % -67
det(C) % -444
det(D) % 3
det(E) % 18
det(F) % 11
% Inverse
inv(A)
inv(B)
inv(C)
inv(D)
inv(E)
inv(F)
% Gauss function
clear
A=[2,1,-3;-1,3,2;3,1,-3]
X=[-1,12,0]
gauss(A,X)
X=[-1;12;0]
gauss(A,X)
A=[1,1;2,1]
X=[10,16]
gauss(A,X)
A=[1,1,1;2,1,2;1,2,3]
X=[6,10,14]
gauss(A,X)
% LU decomposition
F = [1,2,8; 4,4,6; 1,8,9]
[L,U,P] = lu(F)
P*F
L*U
P*F==L*U
G = [7,12,4; 21,33,6; 17,8,33]
[L,U,P] = lu(G)
P*G==L*U
H = [1,2,8; 4,9,6; 2,5,3]
[L,U,P] = lu(H)
P*H==L*U
K = [2,2,8; 4,4,6; 1,8,9]
[L,U,P] = lu(K)
P*K==L*U
