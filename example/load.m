clear
% Test load function.
% Load file from GitHub
YEAR = 2023
load('https://raw.githubusercontent.com/sergiolindau/mathjslab-calculator/main/script/easter.m')
MONTH
DATE
% Load file using CDN
MONTH = 10
DATE = 8
load('https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/script/weekday.m')
WEEKDAY
% Load file using relative path
load('example/indexing-right.m')
A
