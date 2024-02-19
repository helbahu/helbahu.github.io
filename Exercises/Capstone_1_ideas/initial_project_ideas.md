# Project Ideas

In this file (but not restricted to), you can use to get used to working on this repository and jot down project ideas to easily be shared with your mentors and to keep the history of!

## Capstone Project Ideas

1. Medical Triage App (First choice)
    - This app will use the [Infermedica Api](https://developer.infermedica.com/documentation/).
    - The api provides a triage post method that requests a unique interview_id and a json object
    containing the patient information including: age, sex, risk factors, and symptoms. The 
    response will be an object that will give a list of possible conditions ranked in order of
    probability. Also, you will get a suggestion that will tell us if we have enough questions
    answered to be confident in the result or if we need a follow up question, which would be 
    provided if necessary.
    - The app will be a handy app that can triage patients and get recommendations based on the result.
    Recommendations can incllude seeing a doctor, going to the ER, etc. This should not be a substitute 
    for a hospital or a healthcare professional. The app will have a dashboard for healthcare 
    professionals such as doctors/nurses, that will get the results of their patients' interview
    results.  
    -NOTES:
        - May use [Html2pdf.App](https://html2pdf.app/?ref=apilist.fun) as a useful tool if doctors want
        the result of a patient interview as a PDF file they could save/print in their systems at their
        hospitals. [Pdfshift](https://pdfshift.io/?ref=apilist.fun) is another option that offers the 
        same functionality.
    - Additional features may include:
        - Allow users to schedule appointments with healthcare professionals based on the triage results,
        especially if an interview result recommends it.
        - Also when users sign up they are advised to include a list of the medications they take, as
        some symptoms may be side effects from a medication. Everytime a patient starts an interview, 
        they would be advised to ensure that their medication list is up to date and that includes
        adherence status.
        - Can organize interviews and the symptoms linked with each interview to look at trends of the 
        results. For instance, if a patient is a diabetic and you had multiple interviews over the years,
        you cann use a query to look for all interviews that had the blood sugar and look at the results
        over time. This can give lots of information to healthcare professionals. 
        - A user will have the following profile info: name, age, sex, contact info (number, email, etc.), emergency contact, past medical history/conditions, current medications, risk factors, lifestyle (ie. diet, alcohol, smoking, exercise), and other info.


2. Food Recipes App (Second choice)
    - This app will use one of the following APIs:
        - [Spoonacular API](https://spoonacular.com/food-api).
        - [TheMealDB Api](https://www.themealdb.com/api.php).
    - The apis provide recipes, ingredients, products, and instructions.
    - The app will allow users to search for and see diferent recipes according to their filter results, and
    they can follow the instructions with a chekclist. 
    - The app's database will have the user, their search history, favorite and completed recipes, and search preferences.
    - In addition, the app can have a function where the user can provide the search with all ingredients that the user has 
    available and provide recommendations based on that.
    - The Spoonacular API has grocery stores as an options and shows products that can be purchased there. Using this, the app
    can help the user make a shopping list based on a recipe they want and the missing ingredients they are looking for. 

3. Music/Songs App
   - This app will use one of the following APIs:
        - [Audio Db](https://www.theaudiodb.com/free_music_api)
        - [Spotify](https://developer.spotify.com/documentation/web-api)
        - [Freesound API](https://freesound.org/docs/api/index.html?ref=apilist.fun)
    - The apis provide info about artists, albums, songs/tracks, etc.
    - An idea is to make a app that you can listen to music, and make playlists for your favorite songs, and you
    can search for songs/artists by genre.






