dir=tmp
if [[  -e $dir ]]; then
  rm -r $dir
fi

mkdir $dir

cp -r ./stylesheets/ tmp/stylesheets
cp -r ../index.js tmp/index.js
cp -r ../js tmp/js
cp -r double-diagonal tmp/double-diagonal
cp -r linkable tmp/linkable
cp index.html tmp/
cp demo.js tmp/

echo "built examples; to clean up, 'npm clean-examples' " 
