@echo off
echo ===================================================
echo Syncing Dhruv-Portfolio Final Changes to GitHub
echo ===================================================
echo.
echo 1. Staging files...
git add .
echo.
echo 2. Committing...
git commit -m "feat: remove Outside of Work section and clean up associated styles/selectors"
echo.
echo 3. Pushing to GitHub...
git push
echo.
echo ===================================================
echo Done! Please refresh your website.
echo ===================================================
pause
