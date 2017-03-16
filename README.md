```
git init
git remote add origin git@github.com:kissarat/vkontakte-wall.git
npm init
npm install webpack babel-core babel-plugin-transform-class-properties babel-polyfill babel-preset-es2015 \
    babel-preset-stage-1 json-loader babel-preset-react babel-preset-react babel-cli babel-loader --save-dev
npm install react react-dom react-router@3.0.0 semantic-ui-react --save
cd react && webpack -w
git add -A
git commit -m "initial"
```
