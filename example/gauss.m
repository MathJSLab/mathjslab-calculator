% Testando função gauss
A=[2,1,-3;-1,3,2;3,1,-3]
X=[-1,12,0]
gauss(A,X)
X=[-1;12;0]
gauss(A,X)
Z=X.'
gauss(A,X)
A=[1,1;2,1]
X=[10,16]
gauss(A,X)
A=[1,1,1;2,1,2;1,2,3]
X=[6,10,14]
gauss(A,X)
