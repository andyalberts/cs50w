import sys

#handles ValueError (input of a str instead of int)
try:
    x = int(input("x: "))
    y = int(input("y: "))
except ValueError: 
     print("Error: Invalid Input")
     sys.exit(1)


#if user divides by 0, ZeroDivisionError is thrown
try:
    result = x / y
#how to handle the exception error
except ZeroDivisionError:
        print("Error: Cannot divide by 0.")
        #exits program
        sys.exit(1)


print(f"{x} / {y} = {result}")