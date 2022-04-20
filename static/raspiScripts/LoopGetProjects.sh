#!/bin/sh
#base_url="https://backend.coolestprojects.be/website/"
base_url="https://backend-test.coolestprojects.be/website/"
#base_url="https://backend.coolestprojects.localhost:1234/website/"
wait_time=10
old_process=-1
while :
do
	# get latest project ids
	data=$(curl -s --insecure ${base_url}project-list/2/)
	list=$( echo $data | jq -c '.[].id' )
	
	# display special pages
	DISPLAY=:0.0 XAUTHORITY=/home/pi/.Xauthority chromium-browser https://coolestprojects.be/ --incognito  --kiosk  & disown
	process=$!
	sleep $wait_time
	echo new: $process old: $old_process
	#kill $process
	old_process=$process
	
	# loop projects
	for project_id in $list
	do
	echo ProjectId: $project_id
		DISPLAY=:0.0 XAUTHORITY=/home/pi/.Xauthority chromium-browser ${base_url}video-presentation/2/?ProjectId=$project_id --disable-gpu --incognito --kiosk & disown
		process=$!
		sleep $wait_time
		if [ $old_process -gt 0 ] 
		then
			kill $old_process
		fi
		echo new: $process old: $old_process
		old_process=$process
	done
	kill $old_process
done