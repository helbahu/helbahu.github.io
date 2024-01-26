-- Comments in SQL Start with dash-dash --

-- 1. Find the app with an ID of 1880
    -- SELECT app_name FROM analytics WHERE id = 1880;  

-- 2. Find the ID and app name for all apps that were last updated on August 01, 2018.
    -- SELECT id, app_name FROM analytics WHERE last_updated = 'August 01, 2018';

-- 3. Count the number of apps in each category, e.g. “Family | 1972”.
    -- SELECT category, COUNT(*) FROM analytics GROUP BY category;

-- 4. Find the top 5 most-reviewed apps and the number of reviews for each.
    -- SELECT app_name, reviews FROM analytics 
    -- ORDER BY reviews DESC
    -- LIMIT 5;

-- 5. Find the app that has the most reviews with a rating greater than equal to 4.8.
    -- SELECT app_name, reviews FROM analytics 
    -- WHERE rating >= 4.8
    -- ORDER BY reviews DESC
    -- LIMIT 1;

-- 6. Find the average rating for each category ordered by the highest rated to lowest rated.
    -- SELECT category, AVG(rating) FROM analytics GROUP BY category ORDER BY AVG(rating) DESC;

-- 7. Find the name, price, and rating of the most expensive app with a rating that’s less than 3.
    -- SELECT app_name, price, rating FROM analytics
    -- WHERE rating < 3
    -- ORDER BY price DESC
    -- LIMIT 1;

-- 8. Find all apps with a min install not exceeding 50, that have a rating. Order your results by 
--    highest rated first.
    -- SELECT app_name FROM analytics 
    -- WHERE min_installs <= 50
    -- AND rating >= 0
    -- ORDER BY rating DESC; 

-- 9. Find the names of all apps that are rated less than 3 with at least 10000 reviews.
    -- SELECT app_name FROM analytics
    -- WHERE rating < 3
    -- AND reviews >= 10000;

-- 10. Find the top 10 most-reviewed apps that cost between 10 cents and a dollar.
    -- SELECT app_name FROM analytics
    -- WHERE price BETWEEN 0.10 AND 1.00
    -- ORDER BY reviews DESC
    -- LIMIT 10;

-- 11. Find the most out of date app. Hint: You don’t need to do it this way, but it’s possible to do with 
--     a subquery: http://www.postgresqltutorial.com/postgresql-max-function/
    -- SELECT app_name FROM analytics
    -- ORDER BY last_updated
    -- LIMIT 1;

    -- OR (USING a SUBQUERY)

    -- SELECT app_name FROM analytics 
    -- WHERE last_updated = (SELECT MIN(last_updated) FROM analytics);

-- 12. Find the most expensive app (the query is very similar to #11).
    -- SELECT app_name FROM analytics 
    -- WHERE price = (SELECT MAX(price) FROM analytics);

-- 13. Count all the reviews in the Google Play Store.
    -- SELECT SUM(reviews) FROM analytics;

-- 14. Find all the categories that have more than 300 apps in them.
    -- SELECT category FROM analytics
    -- GROUP BY category 
    -- HAVING COUNT(app_name) > 300;

-- 15. Find the app that has the highest proportion of min_installs to reviews, among apps that have 
--     been installed at least 100,000 times. Display the name of the app along with the number of 
--     reviews, the min_installs, and the proportion.
    -- SELECT app_name,reviews,min_installs,(min_installs/reviews) AS proportion FROM analytics
    -- WHERE min_installs > 100000 
    -- AND min_installs/reviews = (SELECT MAX(min_installs/reviews) FROM analytics);


-- FURTHER STUDY

-- FS1. Find the name and rating of the top rated apps in each category, among apps that have been installed 
--      at least 50,000 times.
    --  SELECT app_name, rating FROM analytics x
    --  WHERE min_installs >= 50000 
    --  AND rating = (SELECT MAX(rating) FROM analytics y WHERE y.category = x.category);

-- FS2. Find all the apps that have a name similar to “facebook”.
    --  SELECT app_name FROM analytics
    --  WHERE app_name ILIKE '%facebook%';

-- FS3. Find all the apps that have more than 1 genre.
    -- SELECT app_name, genres FROM analytics
    -- GROUP BY app_name,genres 
    -- HAVING array_length(genres,1) > 1;

-- FS4. Find all the apps that have education as one of their genres.
    -- SELECT app_name FROM analytics
    -- GROUP BY app_name,genres 
    -- HAVING genres @> ARRAY['education'];
    

--RESOURCES
    -- Array Functions and Operators: https://www.postgresql.org/docs/current/functions-array.html
    --                                https://www.postgresql.org/docs/8.4/functions-array.html
    -- Pattern Matching: https://www.postgresql.org/docs/current/functions-matching.html
    -- SQL Zoo: https://sqlzoo.net/wiki/SQL_Tutorial

