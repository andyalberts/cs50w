x = int(input("x: "))
y = int(input("y: "))


#if user divides by 0, ZeroDivisionError is thrown
try:
    result = x / y
#how to handle the exception error
except ZeroDivisionError:
        print("Error: Cannot divide by 0.")
        #exits program
        sys.exit(1)


print(f"{x} / {y} = {result}")