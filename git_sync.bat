@echo off
echo ===================================================
echo Syncing Dhruv-Portfolio Final Changes to GitHub
echo ===================================================
echo.
echo 1. Staging files...
git add .
echo.
echo 2. Committing...
git commit -m "feat: implement responsive tablet/mobile breakpoints and fix cascade overrides"
echo.
echo 3. Pushing to GitHub...
git push
echo.
echo ===================================================
echo Done! Please refresh your website.
echo ===================================================
pause
