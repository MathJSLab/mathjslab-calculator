t = [0,3,2,5,0,3,5,1,4,6,2,4]
year = YEAR-(MONTH<2)
WEEKDAY = mod(year + trunc(year/4) - trunc(year/100) + trunc(year/400) + t[MONTH] + DATE, 7)
