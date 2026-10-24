Files in this folder are copied to the root of the deployed site.

The deploy workflows copy the Core teachers' book (`output/core-web`) into
this folder before staging, so https://innodems.github.io/CBC-Grade-12-Maths/
serves that book directly. Keep this folder in the repo: without it PreTeXt
tries to generate its own landing page instead.
