import datetime

def print_time_and_message():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"{now} Have a good one")

# Call the function
print_time_and_message()