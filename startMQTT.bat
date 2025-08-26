cd mosquitto

mosquitto -p 1883 -v -c <(echo -e "listener 1883 0.0.0.0\nallow_anonymous true")