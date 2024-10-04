clear
% Test array operations
A = [1,2,0;1,1,0;-1,4,0]
B = [1,2,3;1,1,-1;2,2,2]
C = [1,2,3;1,1,-1;1,1,1]
D = [1,3,-9,5;2,-3,-5,5;2,8,-1,7;3,-4,3,6]
% Sum
F = A + B
% Scalar product
G = 2 * A
H = A * 2
% Division
M = A/B
% Negative
-M
% Mapping
sin(M)
clear
a=2
A=[1,2,3;4,5,6;7,8,9]
B=[3,4,5;6,7,8;9,10,11]
C=[3,4,5]
D=[3;4;5]
F=[1,2,3,4]
G=[1;2;3;4]
A+a
a+A
A+B
A+C
A+D
A+F % error
A+G % error
A-a
a-A
A-B
A-C
A-D
A-F % error
A-G % error
A*B
3*A
A*3
A=[1,2,4;4,5,6]
B=[1,2;3,4;5,6]
A*B
A.*B % error
A*[1,2,3] % error
A.*[1,2,3]
A=[1:3;4:6;7:9]
[1:3;4,5,6,7;7,8,9] % error
A=[1:3;4,5,6,7;7,8,9] % error
A=[1,2,3;4,5;7,8,9,10] % error
A=[pi/6,pi/2,3*pi/2]
size(A)
size(A')
A=[pi/6,pi/2,3*pi/2;3*pi,pi,6;7,8,9]
size(A)
B=sin(A)
A = [1,2,3;4,5,6;7,8,9]
C = A.^-1
a = [2,3]
b = (1:3)'
a = [2,3]
b = (1:3)'
a+b
b+a
a.^b
A = -1
B = 1/3
C = A.^B
A(1,1,3) % error
A(1) % error
A(1,1) % error
A(1,1)=100
A+B
A+C
A+D
A+E % error
A+F
A+G
A+H % error
1*D
D*1
2*C
C*2
D*D % error
D.*D' % broadcasting
A = [1, 1, 1; 2, 2, 2; 3, 3, 3]
m = [2, 4, 6]
A - m
a = [1, 2, 3, 4]
b = [5; 6; 7]
a + b
A*D
