clear
% Test array concatenation
A = zeros(3,3)
B = ones(3,3)
C = 2 * ones(3,3)
[A, B]
horzcat(A, B)
cat(2, A, B)
[A; B]
vertcat(A, B)
cat(1, A, B)
cat(3, A, B)
[A, B, C]
horzcat(A, B, C)
cat(2, A, B, C)
[A; B; C]
vertcat(A, B, C)
cat(1, A, B, C)
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
cat(1, zeros(3, 3, 3), ones(3, 3, 3), 2 * ones(3, 3, 3))
cat(2, zeros(3, 3, 3), ones(3, 3, 3), 2 * ones(3, 3, 3))
cat(3, zeros(3, 3, 3), ones(3, 3, 3), 2 * ones(3, 3, 3))
cat(3, zeros(3, 3), ones(3, 3), 2 * ones(3, 3))
cat(2, zeros(3, 3, 3), ones(3, 3, 3), 2 * ones(3, 3)) % error
