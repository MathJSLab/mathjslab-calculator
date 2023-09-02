# Testando operações de matrizes
# Cria a matriz 3x3 com elementos nulos
A = zeros(3)
ones([3,7])
zeros(4,9)
# Cria a matriz identidade 3x3
A = eye(3)
# Traço da matriz
traco(A)
# Define matrizes para operar
A = [1,2,0;1,1,0;-1,4,0]
B = [1,2,3;1,1,-1;2,2,2]
C = [1,2,3;1,1,-1;1,1,1]
D = [1,3,-9,5;2,-3,-5,5;2,8,-1,7;3,-4,3,6]
# Soma
F = A+B
# Produto
G = 2*A
H = A*2
K = A*B
L = A*C
# Apesar de B diferente de C o produto A*B e A*C resulta igual
# Divisão
M = A/B
# Negativo
-M
# mapear função
sin(M)
# Matriz transposta
N = transp(M)
