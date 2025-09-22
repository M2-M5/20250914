# numbers=[1,2,3,4,5,6,7,8,9,10]
# squared_numbers=[x**2 for x in numbers]
# print(squared_numbers)

# car_makes=["Toyota","Honda","Ford","Chevrolet","Nissan"]
# print(car_makes)

# car_makes_copy=[]
# for car_make in car_makes:
#     car_makes_copy.append(car_make)
# print(car_makes_copy)

# car_makes_copy[1]="VW"
# print(car_makes_copy)
# print(car_makes)

# cell_phones=["iPhone","Samsung","Google Pixel","OnePlus","Nokia"]
# cell_phones_copy=[cell_phone for cell_phone in cell_phones if cell_phone != "OnePlus"]
# print(f"Copied cell phones: {cell_phones_copy}")
# numbers=[1,2,3,4,5,6,7,8,9,10]
# squared_numbers=[n**2 for n in numbers if n % 2 == 0]
# print(f"Squared numbers: {squared_numbers}")

# contries=["USA","Canada","Mexico","Brazil","Argentina","UK","Germany","France","Italy","Spain"]
# european_countries=[country for country in contries if country in ["UK","Germany","France","Italy","Spain"]]
# print(f"European countries: {european_countries}")

# contries=["USA","Canada","Mexico","Brazil","Argentina","UK","Germany","France","Italy","Spain","usa","canada"]
# unique_countries=set([country.upper() for country in contries])
# print(f"Unique countries: {unique_countries}")

# names=["Alice","Bob","Charlie","David","Eve","Frank","Grace","Heidi","Ivan","Judy"]
# department_names=["HR","Finance","Engineering","Marketing","Sales"]
# combined_list=[(name,department) for name in names for department in department_names if len(name) <=5 and len(department)<=7]
# print(f"Combined list: {combined_list}")

# original={"apple":30,"banana":20,"cherry":25}
# flipped={value:key for key,value in original.items()}
# print(f"Flipped dictionary: {flipped}")

# some_booleans=True
# print(f"Some booleans: {some_booleans}")    
# num=5
# print(f"num==5: {num==5}")

#acepted a numbr from user and check if it is even then print out the square of the number
# number=int(input("Enter a number: "))
# if number % 2 == 0:
#     print(f"The square of the number is: {number**2}")

#pyhon 
# accept the user's age
# if the user is in the range of 20 - 65 the user is eligible for this position
# otherwise the user is not eligible for this position
# age=int(input("Enter your age: "))
# if 20 <= age <= 65:
#     print("You are eligible for this position.")
# else:
#     print("You are not eligible for this position.")
# ask the student to enter the marks scored in the math
# if the marks are greater than or equal to 90 the grade is A
# if the marks are greater than or equal to 75 the grade is B
# if the marks are greater than or equal to 60 the grade is C
# marks=int(input("Enter your marks: "))
# if marks >= 90:
#     print("Grade: A")
# elif marks >= 75:
#     print("Grade: B")
# elif marks >= 60:
#     print("Grade: C")
# print(f"Original car makes: {marks}")

# dog_ages=[
#     ("Buddy",3),
#     ("Max",5),
#     ("Bella",2),
#     ("Lucy",4),
#     ("Daisy",1)
# ]

# for dog,age in dog_ages:
#     print("Dog %s is %d years old." % (age,dog))
