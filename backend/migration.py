import uuid
from pathlib import Path
import json
def get_id():
    return "a"+uuid.uuid4().hex
def migration_id_papers():
    curr_path = Path(__file__).parent
    with open(curr_path/'data.json', 'r',encoding='utf-8') as f:
        data = json.load(f)
    for i in range(len(data['papers'])):
        data['papers'][i]['id'] = get_id()
    with open(curr_path/'data.json', 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4)
def migration_tags():
    curr_path = Path(__file__).parent
    with open(curr_path/'data.json', 'r',encoding='utf-8') as f:
        data = json.load(f)
    for i in range(len(data['tags'])):
        data['tags'][i] = {
            "id": get_id(),
            "name": data['tags'][i]
        }
    with open(curr_path/'data.json', 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4)
def title_modif():
    with open('data.json', 'r',encoding='utf-8') as f:
        data = json.load(f)
    for i in range(len(data['papers'])):
        # modify bibtex.title into [bibtex.title]
        title = data['papers'][i]['bibtex']['title']
        if isinstance(title, list):
            continue
        if isinstance(title, str):
            data['papers'][i]['bibtex']['title'] = [title]
    with open('data.json', 'w',encoding='utf-8') as f:
        json.dump(data, f, indent=4)
if __name__ == "__main__":
    # migration_id_papers()
    # migration_tags()
    title_modif()