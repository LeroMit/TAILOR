# TAILOR Project

| ![Insalogo](./images/logo-insa_0.png)| ![TailorLogo](./images/logo.png)|
| ------------- | ------------- |


Project [SMART(PLD)](riccardotommasini.com/teaching/smart) is provided by [INSA Lyon](https://www.insa-lyon.fr/).

Students: **Evann GUILLOT, Zyad HADDAD, Tim MOREL, Nicolas THAIZE, Marie ROULIER, Clément Vial, Hugo WARIN**

### Abstract

## Description 
The majority of social networks today, whether Instagram, Tiktok or others, base their algorithm on several factors, which are often unknown to the user: friends, location, recent searches...
These algorithms can be a source of confusion for the customer for two main reasons:
- The user may feel that the algorithm is using his data against him in order to trap him in a circle of addiction, thus reinforcing the use of the application to the detriment of his mental health.
- There is very little choice in the content you want to watch, with a predetermined flow of content. 

In order to provide a solution to these needs, we would like to propose a new social network: TAILOR.
As its name suggests, the key feature is the tailoring of feeds. So, on an interface accessible to all, the user has control over every detail of the content he or she wishes to view. Whether chronological (choosing to show the weather in the morning or soccer on Fridays, for example), location-based (content related to studies when connected to the school network), or any other combination of parameters (one could even imagine a feed that modulates content according to facial expressions).

## Project Goal
- **Page feed**: This page is the heart of our application. Our aim will be to provide a fluid platform for switching from one video to another without being too memory-intensive. We'll also have to find the best way of storing the videos. For each video, the user must be able to like and/or comment on it.

- **Page toolbox**: This page is essential, as it represents what sets us apart from other social networks, i.e. personalization options. It will therefore contain processing blocks that can be linked with arrows for serial filtering. The user will therefore have several options to choose from.

- **Training an image and sound recognition model**: This functionality is crucial, as it will enable us to categorize videos, which in turn will give us the opportunity to filter them according to their content via the toolbox page, and thus offer the user exactly what he or she is looking for. (classification)

## Requirements
- **Front** : React native for the app
- **Back** : 	
    - Computer Vision Python → YOLOv8 
	- Back authentification Java → Oauth
	- Vidéo stream + Toolbox + other → Java
- **Database** : not sure yet – surely MongoDB?


## Material



