#! /bin/bash
echo clean build folder..
rm -r build/**
echo run build
npm run build
echo copy package.json and img/ to build
cp package_build.json build/package.json&& cp -r ./img build/img
cd build
echo copy build cotent to deploy folder..
rm -r   ../../../tugajs_build/publicop/*
cp -r * ../../../tugajs_build/publicop/
echo setup deploy folder..
cd ../../../tugajs_build/publicop/
npm i
echo DONE.
