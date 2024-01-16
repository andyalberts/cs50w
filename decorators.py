def announce(f):
    def wrapper():
        print("About to run the function..")
        #run function f
        f()
        print("Done with the function.")
    return wrapper

#add announce decorator to function hello, becomes f
#f() represents hello function
@announce
def hello():
    print("Hello, World!")

hello() 