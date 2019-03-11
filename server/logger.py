import os
import paho.mqtt.client as mqtt

def create_filename():
    data_folder_path = os.path.join(os.getcwd(), "data")
    file_array = os.listdir(data_folder_path)
    if (len(file_array) == 0):
        return "data_0.csv"

    # Put filenames into a dictionary
    file_dictionary = {}
    for filename in file_array:
        file_dictionary[filename] = True

    # Work out appropriate filename
    for index in range(0, len(file_array)):
        current_filename = "data_" + str(index) + ".csv"
        if current_filename not in file_dictionary:
            return current_filename 

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("start")
    client.subscribe("data")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload.decode("utf-8")))
    if msg.topic == "start":
        filename = create_filename()
        print("Created filename - " + filename)
        client.publish("filename", filename)
    elif msg.topic == "data":
        data = str(msg.payload.decode("utf-8"))
        print(data)

    
broker_address = "localhost"
client = mqtt.Client("DAS-logger")

client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_address)

client.loop_forever()