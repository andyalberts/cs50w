#dictionary inside of list
people = [
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Cho", "house": "Ravenclaw"},
    {"name": "Draco", "house": "Slytherin"}
]


#sorts everyone by name
people.sort(key=lambda person: person["name"])

print(people)
