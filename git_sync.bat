@echo off
echo ===================================================
echo Syncing Dhruv-Portfolio Final Changes to GitHub
echo ===================================================
echo.
echo 1. Staging files...
git add .
echo.
echo 2. Committing...
git commit -m "feat(contact): implement FormSubmit AJAX delivery, custom validation errors, and spam/profanity filters"
echo.
echo 3. Pushing to GitHub...
git push
echo.
echo ===================================================
echo Done! Please refresh your website.
echo ===================================================
pause
