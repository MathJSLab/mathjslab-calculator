% Name: weekday.m
% Purpose: Calculate weekday for a given date.
% preconditions: variable YEAR, MONTH and  DATE defined.
t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
W = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
year = YEAR - (MONTH < 3)
WEEKDAY = W(mod(year + fix(year/4) - fix(year/100) + fix(year/400) + t(MONTH) + DATE, 7) + 1)
