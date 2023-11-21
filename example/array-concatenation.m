clear
% Matrices to concatenation
A = [1, 2, 0; 1, 1, 0; -1, 4, 0]
B = [1, 2, 3; 1, 1, -1; 2, 2, 2]
C = [1, 2, 3; 1, 1, -1; 1, 1, 1]
[A, B]
horzcat(A, B)
cat(2, A, B)
[A; B]
vertcat(A, B)
cat(1, A, B)
cat(3, A, B)
[A, B, C]
cat(2, A, B, C)
cat(3, A, B, C)
A = [1, 2, 3; 4, 5, 6]
B = [7, 8, 9; 10, 11, 12]
C = [A, B]
D = [A; B]
F = [A; 7:9]
G = [20; 30; 40]
H = [F, G]
K = [A, B; A, B]
L = [K; [A, B; A, B]]
M = L.'
N = L'
O = [1:5]
P = O.'
Q = O'
R = P.'
S = P'
O = [1:4; A] % error
[1, 2; 3, 4; 6, 6, 7] % error
% multidimensional concatenation
cat(1, ones(3, 3, 3), zeros(3, 3, 3), ones(3, 3, 3))
cat(2, ones(3, 3, 3), zeros(3, 3, 3), ones(3, 3, 3))
cat(3, ones(3, 3, 3), zeros(3, 3, 3), ones(3, 3, 3))
cat(3, ones(3, 3), zeros(3, 3), ones(3, 3))
cat(2, ones(3, 3, 3), zeros(3, 3, 3), ones(3, 3)) % error
