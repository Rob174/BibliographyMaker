# Visualize bibliography

The goal of this project is to provide an interface to ease the litterature review process:
- Enter sources
  - Either from doi (automatic bibtex retrieval with crossref)
  - Or manually by providing the bibtex fields: title, authors, year, url
  - Add tags to each source to distinguish categories
- Visualize a hierarchy of papers based on tags

# TODO
- [ ] Add possibility to enter a source manually
- [ ] Use stores to memorize inputs when switching between pages
- [ ] Visualization as decomposition of graphes
  - [x] Generate graphes from tags structure
  - [ ] Incorporate to the visualization
- [x] Put all papers in the same column ({rank=same; G; H; I; J})
- [x] Switch backend in typescript
- [ ] Correct bug graph visualization