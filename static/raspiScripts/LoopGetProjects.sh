#!/bin/sh

base_url="https://backend.coolestprojects.localhost:1234/website/"
wait_time=10
old_process=-1

while :
do
	# get latest project ids
	data=$(curl -s --insecure ${base_url}project-list/2/)
	list=$( echo $data | jq -c '.[].id' )
	
	# display special pages
	/usr/bin/google-chrome https://coolestprojects.be --incognito --kiosk  & disown
	process=$!
	echo $process
	sleep $wait_time
	kill $process
	
	# loop projects
	for project_id in $list
	do
		/usr/bin/google-chrome ${base_url}video-presentation/2/?ProjectId=$project_id --incognito --kiosk --autoplay-policy=no-user-gesture-required & disown
		process=$!
		echo $process
		sleep $wait_time
		
		if [ $old_process -gt 0 ] 
		then
			kill $old_process
		fi
		
		old_process = process
	done
	
	# display special pages
	/usr/bin/google-chrome https://coolestprojects.be/fr --incognito --kiosk  & disown
	process=$!
	echo $process
	sleep $wait_time
	kill $process
	
done
