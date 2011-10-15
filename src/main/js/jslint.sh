#!/bin/sh

# need to determine how to configure the invocation of jslint.js

echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking mozrepl_startup.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mozrepl_startup.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking crumbs.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js crumbs.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
#echo "Checking mozrepl_startup.mymashup.js...."
#java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mozrepl_startup.mymashup.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
#echo "Checking mymashup.first.attempt.still.useful.js...."
#java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mymashup.first.attempt.still.useful.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking kernel.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js kernel.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking test.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js test.screens.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking bsa.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js bsa.screens.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking mint.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mint.screens.js
echo "-------------------------------------------------------------------------------------------------------------------------------------"
echo "Checking mysearch.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mysearch.js

