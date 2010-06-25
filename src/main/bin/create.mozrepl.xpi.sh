#!/bin/sh
rm mozrepl.xpi
cd mozrepl
zip a -tzip mozrepl.zip *
mv mozrepl.zip ../mozrepl.xpi
cd ..
