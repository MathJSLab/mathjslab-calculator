clear
% Test load function.
% Load file from GitHub
YEAR = 2023
load('https://raw.githubusercontent.com/MathJSLab/mathjslab-demo/main/m-file/easter.m')
MONTH
DATE
% Load file using CDN
MONTH = 10
DATE = 8
load('https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/m-file/weekday.m')
WEEKDAY
% Load file using relative path
load('example/indexing-right.m')
A
