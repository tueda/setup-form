# Development

For maintenance:

```bash
git switch master
git pull origin master

npm install

npm audit fix
npm outdated
npm update

npx npm-check-updates
npx npm-check-updates -u

npm install
npm run all

git commit
```

```bash
git switch releases/v1
git pull origin releases/v1
git merge master
git tag v1.0.x
git tag v1 -f
```

```bash
git push origin master
git push origin releases/v1
git push origin v1.0.x
git push origin v1 -f
```

Then publish the new release.