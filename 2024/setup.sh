#!/bin/sh
mkdir $1
cat template.ts | sed "s/DAY/$1/" > $1/"$1"a.ts
touch $1/$1.test
# wget https://adventofcode.com/2023/day/$1/input -o $1.input
mv ~/Downloads/input.txt $1/$1.input
