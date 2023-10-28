clear
% Matrices to concatenation
A = [1,2,0;1,1,0;-1,4,0]
B = [1,2,3;1,1,-1;2,2,2]
C = [1,2,3;1,1,-1;1,1,1]
[A, B]
[A; B]
horzcat(A,B)
vertcat(A,B)
[A, B, C]
A=[1,2,3;4,5,6]
size(A)
size(A,1)
size(A,2)
size(A,3)
size(A,[1,2,3,4,5,6]) % test linearization
size(A,[1,2,3;4,5,6]) % test linearization
B=[7,8,9;10,11,12]
size(B)
C=[A,B]
size(C)
size(C,1)
size(C,2)
D=[A;B]
F=[A;7:9]
G=[20;30;40]
H=[F,G]
K=[A,B;A,B]
L=[K;[A,B;A,B]]
M=L.'
N=L'
O=[1:5]
P=O.'
Q=O'
R=P.'
S=P'
O=[1:4;A] % error
[1,2;3,4;6,6,7] % error
