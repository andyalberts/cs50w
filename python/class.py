class Flight():
    def __init__(self, capacity):
        #stores these variables within the class
        self.capacity = capacity
        self.passengers = []

    #if seat is available, add passenger
    def add_passenger(self, name):
        if not self.open_seats():
            return False
        self.passengers.append(name)
        return True

    #checks for open seats
    def open_seats(self):
        return self.capacity - len(self.passengers)

#flight capacity set to 3
flight = Flight(3)

#people to add 
people = ["Harry", "Ron", "Hermione", "Ginny"]

#prints if passenger was added to the flight
for person in people:

    if flight.add_passenger(person):
        print(f"Added {person} to flight successfully")
    else:
        print(f"No available seats for {person}")