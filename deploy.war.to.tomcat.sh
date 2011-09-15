#!/bin/sh

mvn war:war
cp target/mymashup-1.0-SNAPSHOT.war /home/nsivraj/forge/personal/tools/apache-tomcat-7.0.16/webapps
