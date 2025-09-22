def process_data(data):
    result = []
    for item in data:
        if item not in result:
            result.append(item)
    return result