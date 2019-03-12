import os
import csv
import paho.mqtt.client as mqtt

CSV_FIELDNAMES = ["time", "gps", "gps_location", "gps_course", "gps_speed", "gps_satellites", \
    "aX", "aY", "aZ",\
    "gX", "gY", "gZ",\
    "thermoC", "thermoF",\
    "pot", "cadence", "power"]

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

# Creates the csv file and places the csv headers
def create_csv_file(filename):
    data_folder_path = os.path.join(os.getcwd(), "data")
    with open(os.path.join(data_folder_path, filename), mode="w", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=CSV_FIELDNAMES)
        writer.writeheader()

# Convert data to a suitable format
def parse_data(data):
    terms = data.split("&")
    data_dict = {}
    filename = ""
    for term in terms:
        key,value = term.split("=")
        if key == "filename":
            filename = value
        else:
            data_dict[key] = value
    return filename, data_dict

# Store data into csv file
def log_data(filename, data):
    data_folder_path = os.path.join(os.getcwd(), "data")
    with open(os.path.join(data_folder_path, filename), mode="a", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=CSV_FIELDNAMES)
        writer.writerow(data)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("start")
    client.subscribe("data")

def on_disconnect(client, userdata, rc):
    print("Disconnected from broker")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload.decode("utf-8")))
    if msg.topic == "start":
        filename = create_filename()
        create_csv_file(filename)
        print("Created filename - " + filename)
        client.publish("filename", filename)
    elif msg.topic == "data":
        data = str(msg.payload.decode("utf-8"))
        filename, parsed_data = parse_data(data)
        log_data(filename, parsed_data)
    
broker_address = "localhost"
client = mqtt.Client()

client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message

client.connect(broker_address)

client.loop_forever()