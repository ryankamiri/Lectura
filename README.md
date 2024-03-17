# Lectura 
![alt text](https://github.com/ryankamiri/PawHacks/blob/main/frontend/static/images/logo.png?raw=true)
Transform your classroom experience with Lectura: seamless live Q&A, interactive polls, and a rewarding point system. Prepare to create a dynamic learning-environment to boost student engagement. 

## Inspiration:
Coming into PawHacks, our team thought of problems that plagued our classrooms. One major problem that we observed in our lectures was participation. We saw our professors were often left disappointed due to the lack of student engagement. Students were also too scared to ask question during class time: causing them to suffer in silence. We sought out a solution by integrating classroom tools and developing a system to incentivize classroom participation.
## What it does:
Introducing Lectura: a desktop app designed to enhance classroom engagement through live Q&A, interactive polls, and a point system. Instructors can upload questions and display them with multiple choices; students earn points by correctly answering these polls or asking insightful questions, which the teacher can manually assign points to and dismiss. This approach encourages students to actively participate, while providing instructors with a tool to facilitate engaging discussions.

## How we built it:
The front-end of Lectura was developed using HTML and Bootstrap as our framework, with React handling the connection to the back-end. The back-end utilizes MongoDB for data storage, web sockets for real-time communication, and Express for server management. The application is hosted on Vercel. 

## Challenges we ran into: 
PawHacks was the first hackathon for most of us, so we decided to try out new software that were unknown to us such as Figma. After skimming through a few videos, we began our design using it. However, after spending much time trying to understand the features and workflow, we ultimately thought it would be better to stick with what we know: HTML and Bootstrap. We also ran into some problems piecing together all the HMTL with React and making it all flow. Our final challenge came when we tried hosting our app on Vercel, which after configuring, we learned that they did not support web sockets. Instead we used Digital Ocean, which supports our needs.

## Accomplishments that we’re proud of:
We’re proud to address a real issue we faced in our time at Northeastern Oakland. We believe Lectura has the ability to enhance the learning experience in classrooms both within Mills College and beyond at other institutions.
Connecting the front-end to the back-end and seeing the project come together was super satisfying. We were also incredibly proud of our collaboration and drive to accomplish an end product. 

## What we learned:
One key take away was that the most effort should be put into the planning and the designing of the app. A lot of time could have been saved if we sat down together to fully plan out our designs and features before we started to code. In addition, the team experimented with many features of Bootstrap and learned a lot through their documentation.


## What’s next for Lectura:
We believe that Lectura has a lot of potential for future development. A few ideas that we were unable to implement: 
- A “shop” where students can spend their points for items such as late passes, merch, etc. 
- A live transcriber using voice-to-text software that will create a transcript in real-time, so if you miss something your professor said, you’re able to go to the transcript instead of waiting till the end of class to rewatch the class recording. 
Different formats for polls, such as selecting multiple choice and entering short response answer. 
- Better user experience: a smoother way to manage multiple classes 

## Built with: 
HTML/Bootstrap, Express.js, React, MongoDB, Web-socketing