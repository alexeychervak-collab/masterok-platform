@echo off
echo Creating Android Keystore for STROYKA...
echo.

keytool -genkey -v ^
  -storetype JKS ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass stroyka123456 ^
  -keypass stroyka123456 ^
  -alias stroyka-key ^
  -keystore app\stroyka-keystore.jks ^
  -dname "CN=STROYKA, OU=Development, O=STROYKA Platform, L=Moscow, ST=Moscow, C=RU"

echo.
echo ✅ Keystore created: app\stroyka-keystore.jks
echo.
echo Store Password: stroyka123456
echo Key Password: stroyka123456
echo Alias: stroyka-key
echo.
pause

