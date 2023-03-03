import uuid
from pathlib import Path
import json
def get_id():
    return "a"+uuid.uuid4().hex
if __name__ == "__main__":
    curr_path = Path(__file__).parent
    with open(curr_path/'data.json', 'r',encoding='utf-8') as f:
        data = json.load(f)
    for i in range(len(data['papers'])):
        data['papers'][i]['id'] = get_id()
    with open(curr_path/'data.json', 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4)