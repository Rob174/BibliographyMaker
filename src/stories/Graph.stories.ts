import type { Meta, StoryObj } from "@storybook/svelte";

import Graph from "./Graph.svelte";
import { v4 as uuidv4 } from "uuid";

const meta = {
  title: "Window/Graph",
  component: Graph,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<Graph>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {
    papers: [
      {
        id: "343afd76-3268-4841-98c8-56c601fe93de",
        doi: "10.1016/j.dam.2005.05.028",
        url: "https://www.sciencedirect.com/science/article/pii/S0166218X05003021",
        tags: [
          {
            id: "74d04170-8836-4828-92a7-71a6eec3e123",
            text: "ds",
          },
        ],
        citations: [
          {
            id: "0e376945-c945-4363-bbf3-c7921a1f5d3a",
            text: "sddsd",
            tags: ["ds"],
            files: [],
          },
        ],
        analysis: "sdf",
        type: "doi",
        title:
          "Title1",
        authors: [
          {
            given: "Jacek",
            family: "Blazewicz",
            sequence: "first",
            affiliation: [],
          },
          {
            given: "Marta",
            family: "Kasprzak",
            sequence: "additional",
            affiliation: [],
          },
        ],
        year: 2006,
        bibtex: {
          indexed: {
            "date-parts": [[2022, 4, 4]],
            "date-time": "2022-04-04T13:21:52Z",
            timestamp: 1649078512268,
          },
          "reference-count": 34,
          publisher: "Elsevier BV",
          issue: "5",
          license: [
            {
              start: {
                "date-parts": [[2006, 4, 1]],
                "date-time": "2006-04-01T00:00:00Z",
                timestamp: 1143849600000,
              },
              "content-version": "tdm",
              "delay-in-days": 0,
              URL: "https://www.elsevier.com/tdm/userlicense/1.0/",
            },
            {
              start: {
                "date-parts": [[2013, 8, 22]],
                "date-time": "2013-08-22T00:00:00Z",
                timestamp: 1377129600000,
              },
              "content-version": "vor",
              "delay-in-days": 2700,
              URL: "https://www.elsevier.com/open-access/userlicense/1.0/",
            },
          ],
          "content-domain": {
            domain: [],
            "crossmark-restriction": false,
          },
          "short-container-title": ["Discrete Applied Mathematics"],
          "published-print": {
            "date-parts": [[2006, 4]],
          },
          DOI: "10.1016/j.dam.2005.05.028",
          type: "journal-article",
          created: {
            "date-parts": [[2005, 11, 24]],
            "date-time": "2005-11-24T12:10:06Z",
            timestamp: 1132834206000,
          },
          page: "718-729",
          source: "Crossref",
          "is-referenced-by-count": 10,
          title: [
            "Computational complexity of isothermic DNA sequencing by hybridization",
          ],
          prefix: "10.1016",
          volume: "154",
          author: [
            {
              given: "Jacek",
              family: "Blazewicz",
              sequence: "first",
              affiliation: [],
            },
            {
              given: "Marta",
              family: "Kasprzak",
              sequence: "additional",
              affiliation: [],
            },
          ],
          member: "78",
          reference: [
            {
              key: "10.1016/j.dam.2005.05.028_bib1",
              unstructured:
                "A. Apostolico, R. Giancarlo, Sequence alignment in molecular biology, in: M. Farach, F. Roberts, M. Waterman (Eds.), Mathematical Support for Molecular Biology, American Mathematical Society DIMACS series, 1997.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib2",
              "doi-asserted-by": "crossref",
              "first-page": "63",
              DOI: "10.1016/S0166-218X(00)00190-6",
              "article-title":
                "Euler circuits and DNA sequencing by hybridization",
              volume: "104",
              author: "Arratia",
              year: "2000",
              "journal-title": "Discrete Appl. Math.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib3",
              "doi-asserted-by": "crossref",
              "first-page": "303",
              DOI: "10.1016/S0022-5193(88)80246-7",
              "article-title":
                "A novel method for nucleic acid sequence determination",
              volume: "135",
              author: "Bains",
              year: "1988",
              "journal-title": "J. Theoret. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib4",
              "series-title": "Digraphs: Theory, Algorithms and Applications",
              author: "Bang-Jensen",
              year: "2001",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib5",
              "doi-asserted-by": "crossref",
              "first-page": "361",
              DOI: "10.1089/106652701752236188",
              "article-title":
                "On the complexity of positional sequencing by hybridization",
              volume: "8",
              author: "Ben-Dor",
              year: "2001",
              "journal-title": "J. Comput. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib6",
              "doi-asserted-by": "crossref",
              "first-page": "113",
              DOI: "10.1089/cmb.1999.6.113",
              "article-title":
                "DNA sequencing with positive and negative errors",
              volume: "6",
              author: "Blazewicz",
              year: "1999",
              "journal-title": "J. Comput. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib7",
              unstructured:
                "J. Blazewicz, P. Formanowicz, M. Kasprzak, W.T. Markiewicz, Method of sequencing of nucleic acids, Polish Patent Application P335786, 1999.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib8",
              unstructured:
                "J. Blazewicz, P. Formanowicz, M. Kasprzak, W.T. Markiewicz, Isothermic oligonucleotide libraries, in: S. Miyano, R. Shamir, T. Takagi (Eds.), Currents in Computational Molecular Biology, poster proceedings of RECOMB, 2000, pp. 97–98.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib9",
              "doi-asserted-by": "crossref",
              "first-page": "40",
              DOI: "10.1016/j.dam.2003.09.006",
              "article-title":
                "Sequencing by hybridization with isothermic oligonucleotide libraries",
              volume: "145",
              author: "Blazewicz",
              year: "2004",
              "journal-title": "Discrete Appl. Math.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib10",
              "doi-asserted-by": "crossref",
              "first-page": "1",
              DOI: "10.1016/S0166-218X(99)00109-2",
              "article-title": "On some properties of DNA graphs",
              volume: "98",
              author: "Blazewicz",
              year: "1999",
              "journal-title": "Discrete Appl. Math.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib11",
              "doi-asserted-by": "crossref",
              "first-page": "1459",
              DOI: "10.1016/S0304-3975(02)00063-4",
              "article-title": "Complexity of DNA sequencing by hybridization",
              volume: "290",
              author: "Blazewicz",
              year: "2003",
              "journal-title": "Theoret. Comput. Sci.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib12",
              "doi-asserted-by": "crossref",
              "first-page": "3746",
              DOI: "10.1073/pnas.83.11.3746",
              "article-title":
                "Predicting DNA duplex stability from the base sequence",
              volume: "83",
              author: "Breslauer",
              year: "1986",
              "journal-title": "Proc. Nat. Acad. Sci. USA",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib13",
              "doi-asserted-by": "crossref",
              "first-page": "114",
              DOI: "10.1016/0888-7543(89)90290-5",
              "article-title":
                "Sequencing of megabase plus DNA by hybridization: theory of the method",
              volume: "4",
              author: "Drmanac",
              year: "1989",
              "journal-title": "Genomics",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib14",
              "doi-asserted-by": "crossref",
              unstructured:
                "G.B. Fogel, K. Chellapilla, D.B. Fogel, Reconstruction of DNA sequence information from a simulated DNA chip using evolutionary programming, in: V.W. Porto, N. Saravanan, D. Waagen, A.E. Eiben (Eds.), Lecture Notes in Computer Science, vol. 1447, Springer, Berlin, 1998, pp. 429–436.",
              DOI: "10.1007/BFb0040795",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib15",
              "doi-asserted-by": "crossref",
              "first-page": "355",
              DOI: "10.1089/10665270252935502",
              "article-title": "Optimal sequencing by hybridization in rounds",
              volume: "9",
              author: "Frieze",
              year: "2002",
              "journal-title": "J. Comput. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib16",
              "doi-asserted-by": "crossref",
              "first-page": "50",
              DOI: "10.1016/0022-0000(80)90004-5",
              "article-title": "On finding minimal length superstrings",
              volume: "20",
              author: "Gallant",
              year: "1980",
              "journal-title": "J. Comput. System Sci.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib17",
              "series-title":
                "Computers and Intractability. A Guide to the Theory of NP-Completeness",
              author: "Garey",
              year: "1979",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib18",
              "first-page": "569",
              "article-title":
                "Can we recover a sequence, just knowing all its subsequences of given length?",
              volume: "8",
              author: "Guenoche",
              year: "1992",
              "journal-title": "Comput. Appl. Biosci.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib19",
              "doi-asserted-by": "crossref",
              unstructured:
                "E. Halperin, S. Halperin, T. Hartman, R. Shamir, Handling long targets and errors in sequencing by hybridization, in: Proc. of Sixth Annu. Internat. Conf. on Research in Computational Molecular Biology RECOMB, 2002, pp. 176–185.",
              DOI: "10.1145/565196.565219",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib20",
              "doi-asserted-by": "crossref",
              "first-page": "141",
              DOI: "10.1089/106652701300312913",
              "article-title": "Multiplex sequencing by hybridization",
              volume: "8",
              author: "Hubbell",
              year: "2001",
              "journal-title": "J. Comput. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib21",
              "doi-asserted-by": "crossref",
              "first-page": "291",
              DOI: "10.1016/0196-6774(85)90046-X",
              "article-title": "The NP-completeness column: an ongoing guide",
              volume: "6",
              author: "Johnson",
              year: "1985",
              "journal-title": "J. Algorithms",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib22",
              "first-page": "31",
              "article-title": "An algorithm for isothermic DNA sequencing",
              volume: "52",
              author: "Kasprzak",
              year: "2004",
              "journal-title": "Bull. Polish Acad. of Sci. Tech. Sci.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib23",
              "series-title":
                "Combinatorial Optimization: Networks and Matroids",
              author: "Lawler",
              year: "1976",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib24",
              "first-page": "1508",
              "article-title":
                "Determination of the nucleotide sequence of DNA using hybridization with oligonucleotides",
              volume: "303",
              author: "Lysov",
              year: "1988",
              "journal-title": "A new method, Dokl. Akad. Nauk SSSR",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib25",
              "doi-asserted-by": "crossref",
              "first-page": "63",
              DOI: "10.1080/07391102.1989.10507752",
              "article-title": "l-tuple DNA sequencing: computer analysis",
              volume: "7",
              author: "Pevzner",
              year: "1989",
              "journal-title": "J. Biomol. Structure Dynam.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib26",
              "series-title":
                "Computational Molecular Biology: An Algorithmic Approach",
              author: "Pevzner",
              year: "2000",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib27",
              "doi-asserted-by": "crossref",
              "first-page": "862",
              DOI: "10.1093/bioinformatics/17.10.862",
              "article-title":
                "Dealing with errors in interactive sequencing by hybridization",
              volume: "17",
              author: "Phan",
              year: "2001",
              "journal-title": "Bioinformatics",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib28",
              unstructured:
                "F.P. Preparata, E. Upfal, System and methods for sequencing by hybridization, United States Patent Application US 2001/0004728 A1, 2001.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib29",
              "series-title": "Introduction to Computational Molecular Biology",
              author: "Setubal",
              year: "1997",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib30",
              "doi-asserted-by": "crossref",
              "first-page": "413",
              DOI: "10.1089/10665270252935548",
              "article-title": "Large scale sequencing by hybridization",
              volume: "9",
              author: "Shamir",
              year: "2002",
              "journal-title": "J. Comput. Biol.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib31",
              unstructured:
                "E.M. Southern, United Kingdom Patent Application GB8810400, 1988.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib32",
              "doi-asserted-by": "crossref",
              "first-page": "879",
              DOI: "10.1093/nar/9.4.879",
              "article-title":
                "The use of synthetic oligonucleotides as hybridization probes. Hybridization of oligonucleotides of mixed sequence to rabbit beta-globin DNA",
              volume: "9",
              author: "Wallace",
              year: "1981",
              "journal-title": "Nucleic Acids Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib33",
              "series-title":
                "Introduction to Computational Biology. Maps, Sequences, and Genomes",
              author: "Waterman",
              year: "1995",
            },
            {
              key: "10.1016/j.dam.2005.05.028_bib34",
              "doi-asserted-by": "crossref",
              "first-page": "14",
              DOI: "10.1093/bioinformatics/19.1.14",
              "article-title":
                "Reconstruction of DNA sequencing by hybridization",
              volume: "19",
              author: "Zhang",
              year: "2003",
              "journal-title": "Bioinformatics",
            },
          ],
          "container-title": ["Discrete Applied Mathematics"],
          "original-title": [],
          language: "en",
          link: [
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003021?httpAccept=text/xml",
              "content-type": "text/xml",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003021?httpAccept=text/plain",
              "content-type": "text/plain",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
          ],
          deposited: {
            "date-parts": [[2019, 4, 7]],
            "date-time": "2019-04-07T18:13:55Z",
            timestamp: 1554660835000,
          },
          score: 1,
          resource: {
            primary: {
              URL: "https://linkinghub.elsevier.com/retrieve/pii/S0166218X05003021",
            },
          },
          subtitle: [],
          "short-title": [],
          issued: {
            "date-parts": [[2006, 4]],
          },
          "references-count": 34,
          "journal-issue": {
            issue: "5",
            "published-print": {
              "date-parts": [[2006, 4]],
            },
          },
          "alternative-id": ["S0166218X05003021"],
          URL: "http://dx.doi.org/10.1016/j.dam.2005.05.028",
          relation: {},
          ISSN: ["0166-218X"],
          "issn-type": [
            {
              value: "0166-218X",
              type: "print",
            },
          ],
          subject: [
            "Applied Mathematics",
            "Discrete Mathematics and Combinatorics",
          ],
          published: {
            "date-parts": [[2006, 4]],
          },
        },
      },
      {
        id: "fcadf338-edb4-4888-981a-ffb2143d5e86",
        doi: "10.1016/j.dam.2005.05.020",
        url: "10.1016/j.dam.2005.05.020",
        tags: [
          {
            id: "7665e06e-f1f2-483a-bd5f-d7e09d41846f",
            text: "dds",
          },
        ],
        citations: [
          {
            id: "0ab63c65-cc34-4d0f-9ecf-51a4a11c4015",
            text: "provement at each iteration gives worse results on average than selecting the first improvement, if the initial so",
            tags: ["dds"],
            files: [],
          },
        ],
        analysis: "sddsds",
        type: "doi",
        title: "Title2",
        authors: [
          {
            given: "Pierre",
            family: "Hansen",
            sequence: "first",
            affiliation: [],
          },
          {
            given: "Nenad",
            family: "Mladenović",
            sequence: "additional",
            affiliation: [],
          },
        ],
        year: 2006,
        bibtex: {
          indexed: {
            "date-parts": [[2023, 6, 26]],
            "date-time": "2023-06-26T08:26:53Z",
            timestamp: 1687768013237,
          },
          "reference-count": 11,
          publisher: "Elsevier BV",
          issue: "5",
          license: [
            {
              start: {
                "date-parts": [[2006, 4, 1]],
                "date-time": "2006-04-01T00:00:00Z",
                timestamp: 1143849600000,
              },
              "content-version": "tdm",
              "delay-in-days": 0,
              URL: "https://www.elsevier.com/tdm/userlicense/1.0/",
            },
            {
              start: {
                "date-parts": [[2013, 7, 17]],
                "date-time": "2013-07-17T00:00:00Z",
                timestamp: 1374019200000,
              },
              "content-version": "vor",
              "delay-in-days": 2664,
              URL: "https://www.elsevier.com/open-access/userlicense/1.0/",
            },
          ],
          "content-domain": {
            domain: [],
            "crossmark-restriction": false,
          },
          "short-container-title": ["Discrete Applied Mathematics"],
          "published-print": {
            "date-parts": [[2006, 4]],
          },
          DOI: "10.1016/j.dam.2005.05.020",
          type: "journal-article",
          created: {
            "date-parts": [[2005, 12, 15]],
            "date-time": "2005-12-15T17:59:32Z",
            timestamp: 1134669572000,
          },
          page: "802-817",
          source: "Crossref",
          "is-referenced-by-count": 74,
          title: ["First vs. best improvement: An empirical study"],
          prefix: "10.1016",
          volume: "154",
          author: [
            {
              given: "Pierre",
              family: "Hansen",
              sequence: "first",
              affiliation: [],
            },
            {
              given: "Nenad",
              family: "Mladenović",
              sequence: "additional",
              affiliation: [],
            },
          ],
          member: "78",
          reference: [
            {
              key: "10.1016/j.dam.2005.05.020_bib1",
              "doi-asserted-by": "crossref",
              "first-page": "387",
              DOI: "10.1287/ijoc.4.4.387",
              "article-title":
                "Fast algorithms for geometric traveling salesman problem",
              volume: "4",
              author: "Bentley",
              year: "1992",
              "journal-title": "ORSA J. Comput.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib2",
              "doi-asserted-by": "crossref",
              "first-page": "791",
              DOI: "10.1287/opre.6.6.791",
              "article-title":
                "A method for solving traveling salesman problems",
              volume: "6",
              author: "Croes",
              year: "1958",
              "journal-title": "Oper. Res.",
            },
            {
              issue: "1",
              key: "10.1016/j.dam.2005.05.020_bib3",
              "doi-asserted-by": "crossref",
              "first-page": "61",
              DOI: "10.1287/opre.4.1.61",
              "article-title": "The traveling salesman problem",
              volume: "4",
              author: "Flood",
              year: "1956",
              "journal-title": "Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib4",
              "doi-asserted-by": "crossref",
              "first-page": "432",
              DOI: "10.1006/jagm.1995.1018",
              "article-title": "Data structures for traveling salesman",
              volume: "18",
              author: "Fredman",
              year: "1995",
              "journal-title": "J. Algorithms",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib5",
              "doi-asserted-by": "crossref",
              "first-page": "449",
              DOI: "10.1016/S0377-2217(00)00100-4",
              "article-title":
                "Variable neighborhood search: principles and applications",
              volume: "130",
              author: "Hansen",
              year: "2001",
              "journal-title": "European J. Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib6",
              "doi-asserted-by": "crossref",
              unstructured:
                "P. Hansen, N. Mladenovic, Variable neighbourhood search in: F. Glover, G. Kochenberger (Eds.), Handbook of Mataheuristics, Kluwer Academic Publishers, Dordrecht, 2003, pp. 145–184.",
              DOI: "10.4114/ia.v7i19.717",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib7",
              "series-title": "Local Search in Combinatorial Optimization",
              "article-title":
                "The traveling salesman problem: a case study in local optimization",
              author: "Johnson",
              year: "1996",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib8",
              "doi-asserted-by": "crossref",
              "first-page": "48",
              DOI: "10.1090/S0002-9939-1956-0078686-7",
              "article-title":
                "On the shortest spanning subtree of a graph and the traveling salesman problem",
              volume: "7",
              author: "Kruskal",
              year: "1956",
              "journal-title": "Proc. Amer. Math. Soc.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib9",
              "doi-asserted-by": "crossref",
              "first-page": "1097",
              DOI: "10.1016/S0305-0548(97)00031-2",
              "article-title": "Variable neighborhood search",
              volume: "24",
              author: "Mladenović",
              year: "1997",
              "journal-title": "Comput. Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib10",
              "doi-asserted-by": "crossref",
              "first-page": "376",
              DOI: "10.1287/ijoc.3.4.376",
              "article-title": "TSP-LIB a traveling salesman library",
              volume: "3",
              author: "Reinelt",
              year: "1991",
              "journal-title": "ORSA J. Comput.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib11",
              "series-title":
                "Proceedings of the 6th Annual Alerton Conference on Communication, Control and Computing",
              "first-page": "814",
              "article-title":
                "Some improved algorithms for computer solution of the traveling salesman problem",
              author: "Steiglitz",
              year: "1968",
            },
          ],
          "container-title": ["Discrete Applied Mathematics"],
          "original-title": [],
          language: "en",
          link: [
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003070?httpAccept=text/xml",
              "content-type": "text/xml",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003070?httpAccept=text/plain",
              "content-type": "text/plain",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
          ],
          deposited: {
            "date-parts": [[2019, 1, 19]],
            "date-time": "2019-01-19T14:51:49Z",
            timestamp: 1547909509000,
          },
          score: 1,
          resource: {
            primary: {
              URL: "https://linkinghub.elsevier.com/retrieve/pii/S0166218X05003070",
            },
          },
          subtitle: [],
          "short-title": [],
          issued: {
            "date-parts": [[2006, 4]],
          },
          "references-count": 11,
          "journal-issue": {
            issue: "5",
            "published-print": {
              "date-parts": [[2006, 4]],
            },
          },
          "alternative-id": ["S0166218X05003070"],
          URL: "http://dx.doi.org/10.1016/j.dam.2005.05.020",
          relation: {},
          ISSN: ["0166-218X"],
          "issn-type": [
            {
              value: "0166-218X",
              type: "print",
            },
          ],
          subject: [
            "Applied Mathematics",
            "Discrete Mathematics and Combinatorics",
          ],
          published: {
            "date-parts": [[2006, 4]],
          },
        },
      },
      {
        id: "fcadf338-edb4-4888-981a-ffb2143d5e86",
        doi: "10.1016/j.dam.2005.05.020",
        url: "10.1016/j.dam.2005.05.020",
        tags: [
          {
            id: "7665e06e-f1f2-483a-bd5f-d7e09d41846a",
            text: "aaze",
          },
        ],
        citations: [
          {
            id: "0ab63c65-cc34-4d0f-9ecf-51a4a11c4016",
            text: "provement at each iteration gives worse results on average than selecting the first improvement, if the initial so",
            tags: ["aaze"],
            files: [],
          },
        ],
        analysis: "sddsds",
        type: "doi",
        title: "Patate et carrotes",
        authors: [
          {
            given: "Pierre",
            family: "Hansen",
            sequence: "first",
            affiliation: [],
          },
          {
            given: "Nenad",
            family: "Mladenović",
            sequence: "additional",
            affiliation: [],
          },
        ],
        year: 2006,
        bibtex: {
          indexed: {
            "date-parts": [[2023, 6, 26]],
            "date-time": "2023-06-26T08:26:53Z",
            timestamp: 1687768013237,
          },
          "reference-count": 11,
          publisher: "Elsevier BV",
          issue: "5",
          license: [
            {
              start: {
                "date-parts": [[2006, 4, 1]],
                "date-time": "2006-04-01T00:00:00Z",
                timestamp: 1143849600000,
              },
              "content-version": "tdm",
              "delay-in-days": 0,
              URL: "https://www.elsevier.com/tdm/userlicense/1.0/",
            },
            {
              start: {
                "date-parts": [[2013, 7, 17]],
                "date-time": "2013-07-17T00:00:00Z",
                timestamp: 1374019200000,
              },
              "content-version": "vor",
              "delay-in-days": 2664,
              URL: "https://www.elsevier.com/open-access/userlicense/1.0/",
            },
          ],
          "content-domain": {
            domain: [],
            "crossmark-restriction": false,
          },
          "short-container-title": ["Discrete Applied Mathematics"],
          "published-print": {
            "date-parts": [[2006, 4]],
          },
          DOI: "10.1016/j.dam.2005.05.020",
          type: "journal-article",
          created: {
            "date-parts": [[2005, 12, 15]],
            "date-time": "2005-12-15T17:59:32Z",
            timestamp: 1134669572000,
          },
          page: "802-817",
          source: "Crossref",
          "is-referenced-by-count": 74,
          title: ["First vs. best improvement: An empirical study"],
          prefix: "10.1016",
          volume: "154",
          author: [
            {
              given: "Pierre",
              family: "Hansen",
              sequence: "first",
              affiliation: [],
            },
            {
              given: "Nenad",
              family: "Mladenović",
              sequence: "additional",
              affiliation: [],
            },
          ],
          member: "78",
          reference: [
            {
              key: "10.1016/j.dam.2005.05.020_bib1",
              "doi-asserted-by": "crossref",
              "first-page": "387",
              DOI: "10.1287/ijoc.4.4.387",
              "article-title":
                "Fast algorithms for geometric traveling salesman problem",
              volume: "4",
              author: "Bentley",
              year: "1992",
              "journal-title": "ORSA J. Comput.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib2",
              "doi-asserted-by": "crossref",
              "first-page": "791",
              DOI: "10.1287/opre.6.6.791",
              "article-title":
                "A method for solving traveling salesman problems",
              volume: "6",
              author: "Croes",
              year: "1958",
              "journal-title": "Oper. Res.",
            },
            {
              issue: "1",
              key: "10.1016/j.dam.2005.05.020_bib3",
              "doi-asserted-by": "crossref",
              "first-page": "61",
              DOI: "10.1287/opre.4.1.61",
              "article-title": "The traveling salesman problem",
              volume: "4",
              author: "Flood",
              year: "1956",
              "journal-title": "Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib4",
              "doi-asserted-by": "crossref",
              "first-page": "432",
              DOI: "10.1006/jagm.1995.1018",
              "article-title": "Data structures for traveling salesman",
              volume: "18",
              author: "Fredman",
              year: "1995",
              "journal-title": "J. Algorithms",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib5",
              "doi-asserted-by": "crossref",
              "first-page": "449",
              DOI: "10.1016/S0377-2217(00)00100-4",
              "article-title":
                "Variable neighborhood search: principles and applications",
              volume: "130",
              author: "Hansen",
              year: "2001",
              "journal-title": "European J. Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib6",
              "doi-asserted-by": "crossref",
              unstructured:
                "P. Hansen, N. Mladenovic, Variable neighbourhood search in: F. Glover, G. Kochenberger (Eds.), Handbook of Mataheuristics, Kluwer Academic Publishers, Dordrecht, 2003, pp. 145–184.",
              DOI: "10.4114/ia.v7i19.717",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib7",
              "series-title": "Local Search in Combinatorial Optimization",
              "article-title":
                "The traveling salesman problem: a case study in local optimization",
              author: "Johnson",
              year: "1996",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib8",
              "doi-asserted-by": "crossref",
              "first-page": "48",
              DOI: "10.1090/S0002-9939-1956-0078686-7",
              "article-title":
                "On the shortest spanning subtree of a graph and the traveling salesman problem",
              volume: "7",
              author: "Kruskal",
              year: "1956",
              "journal-title": "Proc. Amer. Math. Soc.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib9",
              "doi-asserted-by": "crossref",
              "first-page": "1097",
              DOI: "10.1016/S0305-0548(97)00031-2",
              "article-title": "Variable neighborhood search",
              volume: "24",
              author: "Mladenović",
              year: "1997",
              "journal-title": "Comput. Oper. Res.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib10",
              "doi-asserted-by": "crossref",
              "first-page": "376",
              DOI: "10.1287/ijoc.3.4.376",
              "article-title": "TSP-LIB a traveling salesman library",
              volume: "3",
              author: "Reinelt",
              year: "1991",
              "journal-title": "ORSA J. Comput.",
            },
            {
              key: "10.1016/j.dam.2005.05.020_bib11",
              "series-title":
                "Proceedings of the 6th Annual Alerton Conference on Communication, Control and Computing",
              "first-page": "814",
              "article-title":
                "Some improved algorithms for computer solution of the traveling salesman problem",
              author: "Steiglitz",
              year: "1968",
            },
          ],
          "container-title": ["Discrete Applied Mathematics"],
          "original-title": [],
          language: "en",
          link: [
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003070?httpAccept=text/xml",
              "content-type": "text/xml",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
            {
              URL: "https://api.elsevier.com/content/article/PII:S0166218X05003070?httpAccept=text/plain",
              "content-type": "text/plain",
              "content-version": "vor",
              "intended-application": "text-mining",
            },
          ],
          deposited: {
            "date-parts": [[2019, 1, 19]],
            "date-time": "2019-01-19T14:51:49Z",
            timestamp: 1547909509000,
          },
          score: 1,
          resource: {
            primary: {
              URL: "https://linkinghub.elsevier.com/retrieve/pii/S0166218X05003070",
            },
          },
          subtitle: [],
          "short-title": [],
          issued: {
            "date-parts": [[2006, 4]],
          },
          "references-count": 11,
          "journal-issue": {
            issue: "5",
            "published-print": {
              "date-parts": [[2006, 4]],
            },
          },
          "alternative-id": ["S0166218X05003070"],
          URL: "http://dx.doi.org/10.1016/j.dam.2005.05.020",
          relation: {},
          ISSN: ["0166-218X"],
          "issn-type": [
            {
              value: "0166-218X",
              type: "print",
            },
          ],
          subject: [
            "Applied Mathematics",
            "Discrete Mathematics and Combinatorics",
          ],
          published: {
            "date-parts": [[2006, 4]],
          },
        },
      },
    ],
    structure: [
      {
        id: uuidv4(),
        expression: "others",
        children: [
          {
            id: uuidv4(),
            expression: "aaze",
            children: [],
            type: "tag",
          },
          {
            id: uuidv4(),
            expression: "others",
            children: [],
            type: "tag",
          },
        ],
        type: "tag",
      },
    ],
  },
};
