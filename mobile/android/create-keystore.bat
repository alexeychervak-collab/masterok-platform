@echo off
echo Creating Android Keystore for MasterOK...
echo.

keytool -genkey -v ^
  -storetype JKS ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass masterok123456 ^
  -keypass masterok123456 ^
  -alias masterok-key ^
  -keystore app\masterok-keystore.jks ^
  -dname "CN=MasterOK, OU=Development, O=MasterOK Platform, L=Moscow, ST=Moscow, C=RU"

echo.
echo ✅ Keystore created: app\masterok-keystore.jks
echo.
echo Store Password: masterok123456
echo Key Password: masterok123456
echo Alias: masterok-key
echo.
pause




