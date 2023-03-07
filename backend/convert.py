import json
import uuid
import pyperclip
import requests
import os
from rich.progress import Progress, track
from rich.console import Console

# export type PaperJSON = {
#   id: string;
#   bibtex: Bibtex;
#   doi: DOI;
#   relevant_text: string[];
#   tags: string[];
#   analysis: string[];
# };
# export type Author = {
#   given: string;
#   family: string;
# };
# export type DOI = string;
# export type URL = string;
# export type Bibtex = {
#   DOI: DOI;
#   title: string[];
#   author: Author[];
#   URL: URL;
#   issued: {
#     "date-parts": number[][];
#   };
#   published: {
#     "date-parts": number[][];
#   };
#   "published-print": {
#     "date-parts": number[][];
#   };
# };
def infos_doi(doi):
    # Request to crossref to get the bibtext
    url = "https://api.crossref.org/works/" + doi
    # Get the first result, print the bibtext and ask if it is correct
    data = requests.get(url).json()["message"]
    a = console.input("Is the title ok (other/N)? " + data["title"][0] + "\n")
    if a == "N":
        return None
    return data
def make_bibtex(title):
    console.print("Switching to manual mode")
    # Need title, author, date
    authors = []
    while True:
        try:
            d = console.input(
                "Give one of the authors (first space family)? Or " " to end\n"
            )
            if d == "":
                break
            [given, family] = [e.strip() for e in d.split(" ")]
            authors.append({"given": given, "family": family})
        except:
            pass
    date = console.input("Date (YYYY-MM-DD)?\n")
    return {
        "doi": "",
        "title": title,
        "author": authors,
        "URL": article["url"],
        "issued": {"date-parts": [[int(e) for e in date.split("-")]]},
        "published": {"date-parts": [[int(e) for e in date.split("-")]]},
        "published-print": {"date-parts": [[int(e) for e in date.split("-")]]},
    }
console = Console()
def convert(article):
    # open the url in the browser
    os.system("start " + article["url"])
    doi = console.input("DOI?")
    bibtex = None
    if doi != "":
        bibtex = infos_doi(doi)
    if bibtex is None:
        bibtex = make_bibtex(article["name"])
    bibtex["url"] = article["url"]
    return {
        "id": "a" + str(uuid.uuid4()).replace("-", ""),
        "bibtex": bibtex,
        "relevant_text": [e["content"] for e in article["extracted_informations"]] if "extracted_informations" in article else [],
        "tags": [e["name"] for e in article["tags"]],
        "analysis": article["analysis"] if "analysis" in article else "",
    }


if __name__ == "__main__":
    with open("./data_litt_review.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    data = data["articles"]
    Lnew = []
    tags = set()
    with open("./data_litt_review_conv.json", "r", encoding="utf-8") as f:
        v = json.load(f)
        Lnew = v["papers"]
        tags = set([e["name"] for e in v["tags"]])
    data = data[len(Lnew) : ]
    # clear the terminal
    
    for i,article in enumerate(data):
        os.system("cls")
        print(f"Start {article['name']}: {i}/{len(data)}: {i/len(data)*100:.2f}%")
        Lnew.append(convert(article))
        for tag in Lnew[-1]["tags"]:
            tags.add(tag)
        with open("./data_litt_review_conv.json", "w", encoding="utf-8") as f:
            json.dump(
                {
                    "papers": Lnew,
                    "tags": [
                        {"id": "a" + str(uuid.uuid4()).replace("-", ""), "name": e}
                        for e in tags
                    ],
                },
                f,
            )
    

