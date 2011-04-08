#!/bin/sh

# need to determine how to configure the invocation of jslint.js

echo "Checking mozrepl_startup.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mozrepl_startup.js
echo "Checking crumbs.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js crumbs.js
#echo "Checking mozrepl_startup.mymashup.js...."
#java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mozrepl_startup.mymashup.js
#echo "Checking mymashup.first.attempt.still.useful.js...."
#java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mymashup.first.attempt.still.useful.js
echo "Checking kernel.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js kernel.js
echo "Checking test.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js test.screens.js
echo "Checking bsa.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js bsa.screens.js
echo "Checking mint.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mint.screens.js

