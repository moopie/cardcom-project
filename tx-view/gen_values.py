import json
import random
from datetime import datetime, timedelta

file_name = "data.json"

total_count = 25

names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", \
         "Grace", "Heidi", "Ivan", "Judy", "Kathy", "Louis", \
         "Mallory", "Niaj", "Olivia", "Peggy", "Quentin", \
         "Rupert", "Sybil", "Trent"]

statuses = ["pending", "accepted", "rejected"]

def random_date() -> datetime:
    return (datetime.now() - timedelta(days=random.randint(0, 365)))

def gen_values(count: int) -> None:
    """
    Generator that creates a JSON file of transactions.

    :param count: Number of items to generate
    """

    items = []

    for i in range(count):
        items.append({
            "id": i,
            "customer": random.choice(names),
            "amount": round(random.uniform(100.0, 25_000.0), 2),
            "date": random_date().isoformat(),
            "status": random.choice(statuses)
        })

    json_items = list(map(lambda item: json.dumps(item), items))

    with open(file_name, "w") as f:
        f.write("[\n")
        for item in json_items:
            f.write("    " + item)
            if item != json_items[-1]:
                f.write(",\n")
            else:
                f.write("\n")
        f.write("]\n")

if __name__ == "__main__":
    gen_values(total_count)