@echo off
echo ===================================================
echo Syncing Dhruv-Portfolio Final Changes to GitHub
echo ===================================================
echo.
echo 1. Staging files...
git add .
echo.
echo 2. Committing...
git commit -m "feat: implement production-grade theme toggle with emoji and zero-flash persistence"
echo.
echo 3. Pushing to GitHub...
git push
echo.
echo ===================================================
echo Done! Please refresh your website.
echo ===================================================
pause
