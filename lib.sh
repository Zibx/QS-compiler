cd test
mkdir lib
cd lib
git clone git@git.quokka.pub:LikeAWildfire/QComponent4.git
cd QComponent4
npm i
node make

cd ../
git clone git clone git@github.com:sokra/source-map-visualization.git
cd source-map-visualization
npm i
#npm start