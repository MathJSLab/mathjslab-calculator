# Testando singularidades
A=Inf
A=inf
B=-Inf
B=-inf
C=1/0 # Inf
D=i/0 # NaN + Infi
E=(1+i)/0 # Inf + Infi
F=(-1+i)/0 # -Inf + Infi
G=(1-i)/0 # Inf - Infi
H=(-1-i)/0 # -Inf - Infi

0/0 # NaN
Inf/0 # Inf
0/Inf # 0
3/0 # Inf
-3/0 # -Inf
3i/0 # NaN + Infi
-3i/0 # NaN - Infi
(3+3i)/0 # Inf + Infi
(-3+3i)/0 # -Inf + Infi
(3-3i)/0 # Inf - Infi
(-3-3i)/0 # -Inf - Infi
1/Inf # 0
1/-Inf # 0
0/Inf # 0
0/-Inf # 0
2/((3+3i)/0) # 0
3/(3i/0) # 0
Inf/Inf # NaN
Inf/-Inf # NaN
-Inf/Inf # NaN
-Inf/-Inf # NaN
1*Inf # Inf
Inf*1 # Inf
-1*Inf # -Inf
Inf*-1 # -Inf
-Inf*1 # -Inf
-Inf*-1 # Inf
Inf*Inf # Inf
Inf*-Inf # -Inf
0*Inf # NaN
NaN
NaN+NaN*i
-NaN
Inf^2 # Inf
Inf^-2 # 0
Inf^(1/2) # Inf
Inf^0 # 1
Inf^1 # Inf
Inf^-1 # 0
Inf^Inf # Inf
Inf^-Inf # 0
Inf^i # NaN - NaNi
i^Inf # NaN - NaNi
######################### Ainda falta implementação
1^Inf # 1
1^(-Inf) # 1
1^(Inf*i) # NaN - NaNi
1^(-Inf*i) # NaN - NaNi
(-1)^Inf # NaN - NaNi
(-1)^(-Inf) # NaN - NaNi
(-1)^(Inf*i) # 0
(-1)^(-Inf*i) # Inf - NaNi
i^(Inf) # NaN - NaNi
i^(-Inf) # NaN - NaNi
i^(Inf*i) # 0
i^(-Inf*i) # Inf - NaNi
(-i)^Inf # NaN - NaNi
(-i)^(-Inf) # NaN - NaNi
(-i)^(Inf*i) # Inf - NaNi
(-i)^(-Inf*i) # 0
