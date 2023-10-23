# Cálculo do dia da semana

A organização das atividades humanas em ciclos de sete dias é muito antiga e certamente é baseada no período das fases da Lua. Os nomes dos dias da semana na maioria dos idiomas derivam dos nomes objetos não fixos visíveis no céu: a Lua, Mercúrio, Vênus, Sol, Marte, Júpiter e Saturno. Esse sistema de nomes foi introduzido no Império Romano durante a Antiguidade tardia, associado a alguns deuses olímpicos. Em algumas outras línguas, os dias da semana são nomeados conforme as divindades correspondentes da cultura regional.

Durante as várias mudanças de calendário no ocidente (A última foi do calendário juliano para o gregoriano em 1582) o ciclo de dias da semana foi mantido.

Para elaborar um algorítmo que calcule o dia da semana algumas considerações históricas devem ser observadas. Em especial a consideração do início do ano na antiguidade. Desde a antiguidade tardia em Roma o primeiro dia do ano era 1º de março. Por isso a regra do ano bissexto insere um dia no final de fevereiro, que era o final do ano.

A regra antiga do ano bissexto, no calendário juliano, era que os anos divisíveis por 4 teriam um dia acrescentado ao final de fevereiro. Isso incluia 1 dia a cada 4 anos no calendário.

A regra do ano bissexto no atual calendário gregoriano é a seguinte:

O ano é bissexto se for divisível por 4, mas não se for dividido por 100, exceto se for divisível por 400, neste caso será bissexto. Isso inclui 97 dias a cada 400 anos.

No calendário juliano o ano tem em média 365.25 dias. No calendário gregoriano o ano tem em média 365.2425 dias, que é mais próximo do valor do ano trópico.

Um algorítmo que calcule o dia da semana deve considerar os anos bissextos do calendário gregoriano.

Para calcular o número de dias bissextos incrementados desde o ano 0, considerando que as divisões são com resultado inteiro, fazemos:

ano/4 - ano/100 + ano/400

Assim, um algorítmo que calcule o dia da semana deve considerar os dias acrescidos devido aos anos bissextos.

Iniciaremos considerando o número de dias em cada mês no ano e o número de dias acumulados no início de cada mês (num ano não bissexto).

| Mês       | Dias | Acumulado |
| --------- | ---- | --------- |
| Janeiro   | 31   | 0         |
| Fevereiro | 28   | 31        |
| Março     | 31   | 59        |
| Abril     | 30   | 90        |
| Maio      | 31   | 120       |
| Junho     | 30   | 151       |
| Julho     | 31   | 181       |
| Agosto    | 31   | 212       |
| Setembro  | 30   | 243       |
| Outubro   | 31   | 273       |
| Novembro  | 30   | 304       |
| Dezembro  | 31   | 334       |

Tomando o resto da divisão por 7 (o número de das na semana) da coluna 'Acumulado' teremos o número de dias da semana "deslocados" no início de cada mês, ou seja, quantos dias a avançar no dia da semana do início do mês anterior para equivaler ao primeiro dia da semana do mês atual.

| Mês       | Dias | Acumulado | Resto Acumulado/7 |
| --------- | ---- | --------- | ----------------- |
| Janeiro   | 31   | 0         | 0                 |
| Fevereiro | 28   | 31        | 3                 |
| Março     | 31   | 59        | 3                 |
| Abril     | 30   | 90        | 6                 |
| Maio      | 31   | 120       | 1                 |
| Junho     | 30   | 151       | 4                 |
| Julho     | 31   | 181       | 6                 |
| Agosto    | 31   | 212       | 2                 |
| Setembro  | 30   | 243       | 5                 |
| Outubro   | 31   | 273       | 0                 |
| Novembro  | 30   | 304       | 3                 |
| Dezembro  | 31   | 334       | 5                 |

No caso de um ano (não bissexto) o avanço é de 1 dia no dia da semana pois o resto da divisão de 365 por 7 é 1. Considerando o antigo início do ano romano em 1º de março, vamos colocar uma coluna de dias a avançar no dia da semana pela passagem do ano. Por exemplo, considere que a tabela mostra a passagem de dois anos sucessivos. Vamos fazer isso para subtrair o avaço pelo ano do 'Resto Acumulado/7'.

| Mês       | Dias | Acumulado | Resto Acumulado/7 | Avanço ano | Subtração |
| --------- | ---- | --------- | ----------------- | ---------- | --------- |
| Janeiro   | 31   | 0         | 0                 | 0          |  0        |
| Fevereiro | 28   | 31        | 3                 | 0          |  3        |
| Março     | 31   | 59        | 3                 | 1          |  2        |
| Abril     | 30   | 90        | 6                 | 1          |  5        |
| Maio      | 31   | 120       | 1                 | 1          |  0        |
| Junho     | 30   | 151       | 4                 | 1          |  3        |
| Julho     | 31   | 181       | 6                 | 1          |  5        |
| Agosto    | 31   | 212       | 2                 | 1          |  1        |
| Setembro  | 30   | 243       | 5                 | 1          |  4        |
| Outubro   | 31   | 273       | 0                 | 1          | -1        |
| Novembro  | 30   | 304       | 3                 | 1          |  2        |
| Dezembro  | 31   | 334       | 5                 | 1          |  4        |

Somente o mês de outubro resultou num número negativo. Vamos somar 7, resultando em 6, para obter um número positivo. Considerando o ciclo de 7 dias na semana, avançar 6 dias ou recuar 1 dia resulta no mesmo dia da semana.

O resultado é:

| Mês       | Dias | Acumulado | Resto Acumulado/7 | Índice ano | subtração | Resultado |
| --------- | ---- | --------- | ----------------- | ---------- | --------- | --------- |
| Janeiro   | 31   | 0         | 0                 | 0          |  0        | 0         |
| Fevereiro | 28   | 31        | 3                 | 0          |  3        | 3         |
| Março     | 31   | 59        | 3                 | 1          |  2        | 2         |
| Abril     | 30   | 90        | 6                 | 1          |  5        | 5         |
| Maio      | 31   | 120       | 1                 | 1          |  0        | 0         |
| Junho     | 30   | 151       | 4                 | 1          |  3        | 3         |
| Julho     | 31   | 181       | 6                 | 1          |  5        | 5         |
| Agosto    | 31   | 212       | 2                 | 1          |  1        | 1         |
| Setembro  | 30   | 243       | 5                 | 1          |  4        | 4         |
| Outubro   | 31   | 273       | 0                 | 1          | -1        | 6         |
| Novembro  | 30   | 304       | 3                 | 1          |  2        | 2         |
| Dezembro  | 31   | 334       | 5                 | 1          |  4        | 4         |

Este resultado final representa o número de dias a avançar no dia da semana a cada mês, considerando a passagem do ano em 1º de março. Um algorítmo que use este resultado deve considerar o ano anterior se o mês for janeiro ou fevereiro.

Com base nos resultados anteriores, vamos deliear o algorítmo para computar o dia da semana:

Considere a sequência

MD = 0,3,2,5,0,3,5,1,4,6,2,4

indexada de 1 a 12, representando o resultado anterior.

Considere o ano na variável A, o mês na variável M e o dia na variável D. Os meses são indicados de 1 a 12.

A = ano
M = mês
D = data

Então fazemos:

se M<3 então A = A - 1

Esta é a correção da passagem do ano em 1º de março.

Então calculamos o número de dias acrescidos pelos anos bissextos:

B = A/4 - A/100 + A/400

Onde cada divisão resulta em inteiro.

Para calcular um número (o resultado não é único) de dias na semana acrescidos na data atual fazemos

T = A + B + MD[M] + D

Tomamos o resto da divisão deste resultado por 7 e somamos 1. O resultado corresponde ao dia da semana, começando no domingo, contando de 1 a 7.
