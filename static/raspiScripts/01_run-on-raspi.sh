#!/bin/sh
scp LoopGetProjects.sh pi@192.168.2.209:/home/pi
sleep 3
sshpass -vvv -p coolestprojects ssh pi@192.168.2.209 bash LoopGetProjects.sh
