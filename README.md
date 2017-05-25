# mongoose-and-cheerios-news
## aka Corey's News Scraper

### Purpose
Corey's News Scraper scrapes the latest news from Rawstory and generates the headlines and photos with a link to the full story.  The user can create, view, and delete comments for each story.

### Overview
This application is a full stack website that utilizes Node.js, Express, MongoDB, Mongoose, Handlebars.js and Cheerio. 

Node.js and Express are used to query and route data into the app and display the appropriate pages.  Cheerio is used to scrape the data from Rawstory and the data is stored in MongoDB using Mongoose.

The front-end HTML is displayed using the Handlebars.js templating engine.  Each document stored in the MongoDB collection is displayed on the page.  The scraped articles are displayed in reverse order so that the new ones appear on top.  Mongoose is set to only store unique items so that the database does not have to be dropped and reloaded every time the articles are refreshed.  There is a link at the top of the main page to refresh the articles.

Once a comment has been left for a story, there is a button generated to view the previous comments.  When the "view comments" button is clicked, a new page is routed for the story where the user can delete previous comments or leave new ones.

This application is displayed on Heroku and can be view here: [Corey's News Scraper](https://corey-news-scraper.herokuapp.com)
