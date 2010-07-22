#!/bin/sh
GITREPO_HOME=/home/nsivraj/forge/personal/code/repo_git
MOZREPL_HOME=$GITREPO_HOME/mozrepl
cd $GITREPO_HOME
rm mozrepl.xpi
cd $MOZREPL_HOME
zip -r -q mozrepl .
mv mozrepl.zip $GITREPO_HOME/mozrepl.xpi
cd $GITREPO_HOME
