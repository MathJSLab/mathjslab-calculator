% Name: easter.m
% Purpose: Calculate Easter Sunday for a given year.
% Source: Jean Meeus, Astronomical Algorithms ; Richmond (Virginia, États-Unis), Willmann-Bell, 1998, pp. 67–68.
% preconditions: variable YEAR defined.
n = mod(YEAR, 19)                                % metonic cycle
c = fix(YEAR / 100)                              % number of centuries completed
u = mod(YEAR, 100)                               % past years beyond complete centuries
s = fix(c / 4)                                   % number of completed leap centuries Gregorian cycles (400 year cycles, 97 leap years)
t = mod(c, 4)                                    % centuries beyond complete leap cycles
p = fix((c + 8) / 25)                            % proemptosis cycles completed
q = fix((c - p + 1) / 3)                         % proemptosis passed beyond full cycles
E = mod((19 * n + c - s - q + 15), 30)           % epacta
b = fix(u / 4)                                   % number of leap years Julian cycles completed
d = mod(u, 4)                                    % years beyond the Julian cycles of complete leap years
L = mod((32 + 2 * t + 2 * b - E - d), 7)         % dominical letter
h = fix((n + 11 * E + 22 * L) / 451)             % correction
MONTH = fix((E + L - 7 * h + 114) / 31) - 1      % month
DATE = 1 + mod((E + L - 7 * h + 114), 31)        % date
clear n c u s t p q E b d L h
