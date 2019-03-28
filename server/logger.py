import os
import sys
import csv
import paho.mqtt.client as mqtt

CSV_FIELDNAMES = ["time", "gps", "gps_location", "gps_course", "gps_speed", "gps_satellites", \
    "aX", "aY", "aZ",\
    "gX", "gY", "gZ",\
    "thermoC", "thermoF",\
    "pot", "cadence", "power", "reed_velocity", "reed_distance"]

DATA_DIRECTORY = os.path.dirname(os.path.realpath(sys.argv[0]))
DATA_FOLDER_PATH = os.path.join(DATA_DIRECTORY, "data")

def create_filename():
    file_array = os.listdir(DATA_FOLDER_PATH)
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
    filepath = os.path.join(DATA_FOLDER_PATH, filename)
    try:
        with open(filepath, mode="wb+") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=CSV_FIELDNAMES)
            writer.writeheader()
    except Exception as e:
        print("Error: " + str(e))

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
    filepath = os.path.join(DATA_FOLDER_PATH, filename)
    try:
        with open(filepath, mode="ab") as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=CSV_FIELDNAMES)
            writer.writerow(data)
    except Exception as e:
        print("Error: " + str(e))

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