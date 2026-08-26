#!/usr/bin/env bash

echo "=== 1. STANDARD & INTENSE PALETTE (0-15) ==="
for i in {0..15}; do
    # Print a colored block with the number inside
    printf "\e[48;5;%dm  %3d  \e[0m" "$i" "$i"
    (( (i + 1) % 8 == 0 )) && echo
done
echo

echo "=== 2. 6x6x6 COLOR CUBE (16-231) ==="
for r in {0..5}; do
    for g in {0..5}; do
        for b in {0..5}; do
            code=$(( 16 + 36 * r + 6 * g + b ))
            printf "\e[48;5;%dm    \e[0m" "$code"
        done
        echo -n " "
    done
    echo
done
echo

echo "=== 3. GRAYSCALE RAMP (232-255) ==="
for i in {232..255}; do
    printf "\e[48;5;%dm  \e[0m" "$i"
done
echo -e "\n"

