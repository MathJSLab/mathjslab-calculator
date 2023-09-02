A = [1:3;4:6;7:9]
B = [2, 1, -3; 3, 2, 4; 2, 5, -2]
C = [-7,6,3,1; -9,1,6,4; -8,-4,3,6; -5,5,9,2]
D = [1,2,1;0,3,2;0,0,1]
E = [2,1,3,0;5,1,3,2;4,2,5,1;1,2,3,7]
F = [2,1,-3;-1,3,2;3,1,-3]
# Creating
zeros(3)
zeros(3,7)
zeros([3,7])
eye(3)
eye(3,4)
# Determinant
det(A) # 0
det(B) # -67
det(C) # -444
det(D) # 3
det(E) # 18
det(F) # 11
# Inverse
inv(A)
inv(D)
inv(E)
# testing adjoint relation
1/det(E)*adj(E) # same as inv(E)
E
minor(E,3,2)
minor(E,2,3)
cofactor(E)
trace(E) # 15
min(E)
max(E)
mean(E)
