Copy the file startMidori.sh in home folder

Make the script excecutable.

You can test the script if you run the following command. 
`sudo xinit ./startMidori.sh`

Since the browser window open automatically on startup so for it change the file /etc/rc.local
(Since we are using HDMI for test purposes)
sudo xinit /home/pi/startMidori.sh &

The system needs to sign in automatically to be able to run the script. This can be done by changing auto-login property in dietpi-launcher