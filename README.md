##set up##
npm install
jspm install
##create bundle file with jspm##
###The execution will bundle all typescript file under app directory into build directory app.js file###
jspm bundle-sfx app build/app.js
##run the server##
npm start
