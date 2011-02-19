#!/bin/sh

BASE_DIR=/home/nsivraj/forge/personal/code/repo_git/mymashup

java -cp $BASE_DIR/target/classes:$BASE_DIR/src/main/properties com.github.mymashup.MergeMBCounselors > /media/sda1/eclipse-jee-helios-win32/workspace/scouting/Counselor_Merit_Badges/merge.counselor.data.out
