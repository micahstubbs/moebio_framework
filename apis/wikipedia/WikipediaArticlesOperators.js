/**
 * WikipediaArticlesOperators
 * @constructor
 */
function WikipediaArticlesOperators() {};


/**
 * table with the following lists:
 * 0: All wp, 1: article wp, 2: see also, 3: external, 4:images
 */
WikipediaArticlesOperators.getLinksTableFromArticle = function(articleText, completeUrl) {
  var seeAlsoSpan = "<span class=\"mw-headline\" id=\"See_also\">See also</span>";
  var referencesSpan = "<span class=\"mw-headline\" id=\"References\">References</span>";

  var table = new Table();

  var seeAlsoLinks = new StringList();
  var externalLinks = new StringList();

  var remove = ["JSTOR", "Special", "File"];
  var allWPLinks = StringOperators.getAllTextsBetweenStrings(articleText, "<a href=\"//en.wikipedia.org/wiki/", "\"");

  links: for(var i = 0; allWPLinks[i] != null; i++) {
    removes: for(var j = 0; remove[j] != null; j++) {
      if(allWPLinks[i].substr(0, remove[j].length) == remove[j]) {
        allWPLinks.splice(i, 1);
        i--;
        break removes;
        break links;
      }
    }
    if(completeUrl) allWPLinks[i] = "http://en.wikipedia.org/wiki/" + allWPLinks[i];
  }

  allWPLinks = allWPLinks.getWithoutRepetitions();

  var externalLinks = StringOperators.getAllTextsBetweenStrings(articleText, "class=\"external text\" href=\"http:", "\"");

  externalLinks = externalLinks == null ? new StringList() : externalLinks;

  for(i = 0; externalLinks[i] != null; i++) {
    externalLinks[i] = "http://" + externalLinks[i];
  }


  var seeAlsoBlock = StringOperators.getFirstTextBetweenStrings(articleText, "id=\"See_also\">See also</span>", "</ul>");
  if(seeAlsoBlock == null) {
    seeAlsoLinks = new StringList();
  } else {
    seeAlsoLinks = StringOperators.getAllTextsBetweenStrings(seeAlsoBlock, "href=\"//en.wikipedia.org/wiki/", "\"");
  }

  table[0] = allWPLinks;
  table[1] = seeAlsoLinks;
  table[2] = externalLinks;

  return table;
}


WikipediaArticlesOperators.removeArticlesListRepetitions = function(articlesList) {
  var j;
  for(var i = 0; articlesList[i + 1] != null; i++) {
    for(j = i + 1; articlesList[j] != null; j++) {
      if(articlesList[i].title == articlesList[j].title) {
        articlesList.splice(j, 1);
        j--;
      }
    }
  }
}

WikipediaArticlesOperators.cleanTitle = function(title) {
  return decodeURI(title.replace(/_/g, " "));
}

WikipediaArticlesOperators.buildArticlesNetwork = function(articlesList, includeReferredArticles, includeExternalPages) {
  var network = new Network();
  var i;
  var j;

  var article;

  var node0;
  var node1;

  var title;

  // if(includeExternalPages){
  // var articlesToAdd = new List();
  // for(var i=0; articlesList[i]!=null; i++){
  // article = articlesList[i];
  // for(j=0; article.internalLinks[j]!=null; j++){
  // if()
  // }
  // }
  // }

  for(i = 0; articlesList[i] != null; i++) {
    article = articlesList[i];
    node0 = network.nodeList.getNodeById(article.title);

    if(node0 == null) {
      node0 = WikipediaArticlesOperators._createNodeFromArticle(article);
      network.addNode(node0);
      node0.level = i == 0 ? 0 : 1;
      node0.articleType = article.type;
      node0.url = article.url;
    }
    if(includeReferredArticles) {
      //c.log('-', article.title, article.internalLinks.length, article.seeAlsoLinks.length);
      for(j = 0; article.seeAlsoLinks[j] != null; j++) {
        title = article.seeAlsoLinks[j];
        node0 = network.nodeList.getNodeById(title);
        if(node0 == null) {
          node0 = new Node(title, WikipediaArticlesOperators.cleanTitle(title));
          network.addNode(node0);
          node0.level = 2;
          node0.url = "http://en.wikipedia.org/w/index.php?action=render&title=" + title; //[!] assumes the article is en
          node0.articleType = 'unknown';
        }
      }
    }
  }


  for(i = 0; network.nodeList[i] != null; i++) {
    node0 = network.nodeList[i];
    for(j = 0; network.nodeList[j] != null; j++) {
      if(i != j) {
        node1 = network.nodeList[j];
        if(node0.article != null && node0.article.internalLinks.indexOf(node1.id) != -1) {
          network.addRelation(new Relation(node0.name + "_" + node1.name, node0.name + "_" + node1.name, node0, node1));
        }
      }
    }
  }

  return network;
}

WikipediaArticlesOperators._createNodeFromArticle = function(article) {
  var node = new Node(article.title, article.cleanTitle);
  node.article = article;
  node.weight = article.length == null ? 1 : article.length / 10000;
  return node;
}