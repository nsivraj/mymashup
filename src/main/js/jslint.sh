#!/bin/sh

# need to determine how to configure the invocation of jslint.js

echo "Checking mymashup.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js mymashup.js
echo "Checking kernel.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js kernel.js
echo "Checking test.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js test.screens.js
echo "Checking bsa.screens.js...."
java -cp /home/nsivraj/forge/download/rhino/rhino1_7R2/js.jar org.mozilla.javascript.tools.shell.Main jslint.js bsa.screens.js

