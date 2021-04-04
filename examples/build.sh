dir=tmp
if [[  -e $dir ]]; then
  rm -r $dir
fi

mkdir $dir

cp -r ../stylesheets/ tmp/stylesheets
cp -r ../js tmp/js
cp -r double-diagonal tmp/double-diagonal
cp -r linkable tmp/linkable
cp index.html tmp/
cp index.js tmp/
echo "built examples; to clean up, 'yarn clean-examples' " 
