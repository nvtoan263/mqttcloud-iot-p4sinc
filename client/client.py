import paho.mqtt.client as mqtt
import os
from urllib import parse as urlparse

# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

def on_message(client, obj, msg):
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))

def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(client, obj, level, string):
    print(string)
CLEAN_SESSION=True
mqttc = mqtt.Client("Python1",clean_session=CLEAN_SESSION)
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

# Uncomment to enable debug messages
#mqttc.on_log = on_log

# Parse CLOUDMQTT_URL (or fallback to localhost)
url_str = os.environ.get('CLOUDMQTT_URL', 'mqtt://localhost:1883')
url = urlparse.urlparse(url_str)
topic = 'test'



# Connect
broker="m13.cloudmqtt.com"
port=19244
username="cbxsmzwh"
password="KoMgGSp8AnVm"
mqttc.username_pw_set(username, password)
mqttc.connect(broker,port)


# Start subscribe, with QoS level 0
mqttc.subscribe(topic, 0)

# Publish a message
mqttc.publish(topic, "my message")

# Continue the network loop, exit when an error occurs
run = True
while run:
    mqttc.loop()
print("rc: " + str(rc))