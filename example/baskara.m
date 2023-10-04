clear
# Solução da equação de 2º grau:  x^2-10*x+24=0

# definição dos coeficientes
a = 1
b = -10
c = 21

# solução pela fórmula de Bhaskara
Delta = b^2-4*a*c
x1 = (-b + raizq(Delta))/(2*a)
x2 = (-b - raizq(Delta))/(2*a)


# definição da função de 2º grau
f(x) = a*x^2+b*x+c

# mostra gráfico das raízes de f(x)
grafico(f(x),x,min([x1,x2,0])-1,max([x1,x2,0])+1)
