javascript:(function(){
  /*
   * Bookmarklet to get an array of links to the tweets on any twitter page.
   * Useful for getting links to your bookmarked tweets for further archiving.
   * Author: Jiri Prochazka
   * License: Apache-2.0 https://www.apache.org/licenses/LICENSE-2.0.txt
  */
  
  let tweets = [];
  function addTweets(newTweets) {
      tweets = [...new Set([...tweets, ...newTweets])];
  }
  
  const button = document.createElement('button');
  button.innerText = 'Download tweets';
  button.setAttribute('title', 'Scroll to the bottom of the page to load all tweets.');
  button.setAttribute('style', 'position: fixed; top: 1em; left: 1em; z-index: 9990;');
  button.onclick = () => {
      const resultModal = document.createElement('textarea');
      resultModal.setAttribute('style', 'position: fixed; top: 0px; left: 0px; width: 90%; height: 90%; z-index: 9991;'
      +'margin: 3em 5%; background: white; color: black;');
      resultModal.innerText = JSON.stringify(tweets);
      document.body.appendChild(resultModal);
  };
  document.body.appendChild(button);
  
  function setButtonText(numberOfFoundTweets, numberOfTotalTweets) {
      button.innerText = 'Download tweets ('+numberOfFoundTweets+'/'+numberOfTotalTweets+')';
  }
  
  function getTweetLink(article) {
      let tweetLink = undefined;
      const links = article.getElementsByTagName('a');
      for (let i = 0; i < links.length && !tweetLink; i++) {
          const link = links[i];
          const timeTag = link.querySelector('time[datetime]');
          if (timeTag) {
              tweetLink = link.getAttribute('href');
              break;
          }
      }
      return 'https://twitter.com'+tweetLink;
  }
  
  function getTweetLinks() {
      const tweetLinks = [];
      const articles = document.getElementsByTagName('article');
      for (let j = 0; j < articles.length; j++) {
          const article = articles[j];
          const tweetLink = getTweetLink(article);
          tweetLinks.push(tweetLink);
      }
      return tweetLinks;
  }
  
  function isScrolledToBottom() {
      return (document.body.offsetHeight + document.scrollingElement.scrollTop >= document.scrollingElement.scrollHeight);
  }
  
  window.addEventListener('load', (_event) => {
      addTweets(getTweetLinks());
      setButtonText(tweets.length, '?');
  });
  
  window.addEventListener('scroll', (_event) => {
      addTweets(getTweetLinks());
      setButtonText(tweets.length,
          isScrolledToBottom() ? tweets.length :'?');
  });
  
  addTweets(getTweetLinks());
  setButtonText(tweets.length, '?');
  })()
  