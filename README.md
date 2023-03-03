# Visualize bibliography

The goal of this project is to provide an interface to ease the litterature review process:
- Enter sources
  - Either from doi (automatic bibtex retrieval with crossref)
  - Or manually by providing the bibtex fields: title, authors, year, url
  - Add tags to each source to distinguish categories
- Visualize a hierarchy of papers based on tags

# TODO
- [x] Add possibility to enter a source manually
- [x] enter to add new tag/relevant text
- [ ] Use stores to memorize inputs when switching between pages
- [x] Visualization as decomposition of graphes
  - [x] Generate graphes from tags structure
  - [x] Incorporate to the visualization
- [x] Put all papers in the same column ({rank=same; G; H; I; J})
- [x] Switch backend in typescript
- [x] Correct bug graph visualization
- [x] Add export/copy to clipboard to dot
- [x] Add export/copy to clipboard to svg 
- [x] Bug with hierarchical structure on click on node
- [x] Fixed id for a paper in json migration 
  - [x] Migration of current data to "a"+uuid without "-"
  - [x] Migration of tags with uuids
  - [x] Correction of the frontend
- [ ] websocket to avoid spamming the server (requires everything in store)