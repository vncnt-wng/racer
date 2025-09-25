
with open('./tilemaps/test01', 'r') as f:
    allLines = f.readlines()
    for line in allLines:
        items = line.split()
        items = list(map(lambda x: (int(x) - 1), items))
        print(f'{items},')
        