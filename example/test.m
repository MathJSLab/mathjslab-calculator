M=[1,2,3,4,5;'sapo','cão','gato','pato','macaco']
hist(M)


# Testando decomposição LU
A = [1,2,3;4,5,6;7,8,9]
det(A)
B=pivot(A)*A
det(B)
ludec(B)


a=3
A=[1,2,3;4,5,6;7,8,9]
B=[3,4,5;6,7,8;9,10,11]
C=[3,4,5]
D=[3;4;5]
F=[1,2,3,4]
G=[1;2;3;4]
A+a
a+A
A.+B
A+C
A+D
A+F # erro
A+G # erro
A-a
a-A
A-B
A-C
A-D
A-F # erro
A-G # erro
A*B
3*A
A*3
A=[1,2,4;4,5,6]
B=[1,2;3,4;5,6]
A*B
A.*B # erro
A*[1,2,3] # erro
A.*[1,2,3]
A=[1:3;4:6;7:9]
[1:3;4,5,6,7;7,8,9] # erro
A=[1:3;4,5,6,7;7,8,9] # erro
A=[1,2,3;4,5;7,8,9,10] # erro
A()=2
A
A()
A(1) # erro
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
a.+b
b.+a
a.^b
A = -1
B = 1/3
C = A.^B
A(1,1,3) # erro
A(1) # erro
A(1,1) # erro
A(1,1)=100 # erro
A+B
A+C # erro
A+D # erro
A+E
A+F # erro
A+G
A+H # erro
1*D
D*1
2*C
C*2
D*D
A*D # erro
arg(0)
arg(-0)
arg(0i)
arg(-0i)
arg(0-0i)
arg(0+0i)
arg(-0+0i)
arg(-0-0i)
arg(1-i)
arg(-1-i)
arg(-1+i)
arg(1+i)
