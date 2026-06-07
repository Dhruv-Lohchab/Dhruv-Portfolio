@echo off
echo ===================================================
echo Syncing Dhruv-Portfolio Final Changes to GitHub
echo ===================================================
echo.
echo 1. Staging files...
git add .
echo.
echo 2. Committing...
git commit -m "style(connect): final forensic fixes, performance memory optimizations, chatbot fallback, and subpage contact removal"
echo.
echo 3. Pushing to GitHub...
git push
echo.
echo ===================================================
echo Done! Please refresh your website.
echo ===================================================
pause
