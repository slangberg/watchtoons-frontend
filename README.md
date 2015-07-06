# Watchtoons.tv: Using AngularJs/Rails Video Web App
This repo contains all the HTML, SASS , JavaScript, CoffeeScript, and Ruby files that make up the front end for the proof of concept site [Watchtoons.tv](http://www.watchtoons.tv/). The full stack for the website is Postgres, Rails, Slim HTML

## Overview
This site is an in-progress proof of concept hybrid site/web app that was intended to demonstrate a number of different experimental ui design and data management methodologies. 

##The Experimental Features Of The Site Are:
-  **Automatic public data retrieval:** As the site’s back processes new episode and show data it will automatically try to retrieve data and visual assets from public APIs and integrate those into the sites postgres database
- **Client-Side Only User Tracking :** The site uses AngularJs to save  a users view history to local storage, this allows for the site to offer users a custom tailored ui experience without having to store visitor personal info and allows for a very lean back end
- **Seamless Dynamic User Interface:** The site uses AngularJs to deliver dynamic UI elements that can change seamlessly based on available assets and data, user view history and page based controls. This allows for a stable and tailored user experience for all users. 
- **A Dark Base and Focus on Large Visual Assets:** The least successful experiment was to test the user experience of using a black base and white accents to drive focus to the large amount of images accessible via the external APIs. 
