# BibliographyMaker

## Goal

When doing a litterature review, we have a goal in mind, for instance which deep learning architecture is used to tackle autonomous vehicles. However additionnal informations are also interesrting to extract at the same time: for instance is there an easy access to a github repository in the paper? Is this architecture achieving good results? In which category of architecture this architecture belongs?

These informations can be gathered in a text file format. However organizing them takes a long time and is error proned. It is easy to loose the url to a paper. Citations of the papers would be ideal to be sure of the information originally said in the paper. However it is fastidious to find the extracted text that is relevant for a specific goal of our litterature review.

Moreover there are technical limitations: often a screenshot of the paper diagram or equation would be the most relevant information


On the other side we can see that there are separated tools that can solve these problems: it is easy to do a form with keyboard controls and shortcuts to quickly enter and save informations. Crossref offers doi to bibtex services. Graphviz offer the possibility to visualize data as graphs.

This is why the current project has form main goal to provide an interface to make a litterature review from papers quicker by providing
- quick forms to enter references to the paper (by doi or not), citations as text or image and associate tags to each citation
- visualize the papers as graph given 
  - as a hierarchy based around the tags entered
  - as tables to count the number of papers of each category
- a quick way to find, cite and jump to the url of the original paper

## Dev - Getting started

1. Install nodejs
2. Clone this repository (I assume already done if you are here 😋)
3. Cd in frontend2 & `npm install`
4. `npm run storybook`