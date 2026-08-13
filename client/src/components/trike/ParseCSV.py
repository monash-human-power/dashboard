from csv import DictReader
from json import dump

def parseCSV(filePath: str, *fields: str) -> list[tuple]:
    """
    :filePath: location of the .csv file
    :*fields: allows only certain fields to be included 
    """
    with open(filePath, 'r') as csvFile:
        dictData = DictReader(csvFile)

        # Default behaviour if invalid or no fields are provided
        if not fields:
            fields = dictData.fieldnames 

        return [tuple(row[f] for f in fields) for row in dictData]
    
def writeTuplesToJson(filePath: str, tuples: list[tuple]) -> None:
    with open(filePath, 'w') as f:
        dump(tuples, f)

def isIncreasing(numbers: list[int]) -> bool:
    return all(numbers[i] > numbers[i - 1] for i in range(1, len(numbers)))


# caseyTuples = parseCSV("CaseyGPSData.csv", "LATITUDE", "LONGITUDE")
# power1 = parseCSV("CaseyGPSData.csv", "time")
# power2 = parseCSV("CaseyGPSData.csv", "TIME_TOTAL")

# distAndTime = parseCSV("CaseyGPSData.csv", "DISTANCE_m", "TIME_TOTAL")
times = parseCSV("CaseyGPSData.csv", "_id")


def calculateSpeed(distAndTime: list[tuple]) -> list[float]:
    speeds = []

    for i in range(1, len(distAndTime)):
        dist1, time1 = distAndTime[i - 1]
        dist2, time2 = distAndTime[i]

        time_diff = float(time2) - float(time1)
        distance_diff = float(dist2) - float(dist1)
        speed = distance_diff / time_diff

        # Checks for no time difference
        speeds.append(speed if time_diff > 0 else 0)

    return speeds



# speeds = calculateSpeed(distAndTime)

# writeTuplesToJson("CaseyLatLngTuple.json", caseyTuples)
# writeTuplesToJson("CaseySpeeds.json", speeds)
writeTuplesToJson("CaseyTimes.json", times)
# power3 = [p[0] for p in parseCSV("CaseyGPSData.csv", "POWER")]

# [print(type(p)) for p in power3[:5]]
# print(all(p[1] == ',' for p in power3))