## Error: Kotlin Version

Environment: local or expo

Command: `eas build --platform android --profile production -e preview --local --clear-cache`

Error message: 
> This version (1.5.15) of the Compose Compiler requires Kotlin version 1.9.25 but you appear to be using Kotlin version 1.9.24 which is not known to be compatible.  Please consult the Compose-Kotlin compatibility map located at https://developer.android.com/jetpack/androidx/releases/compose-kotlin to choose a compatible version pair (or `suppressKotlinVersionCompatibilityCheck` but don't say I didn't warn you!)

Solution: https://github.com/expo/expo/issues/32844#issuecomment-2712208983

> This worked for me (`expo 52.0.36`):
> 
> ```
> npx expo install --check
> 
> npx expo install expo-build-properties
> ```
> 
> In app.json, add:
> 
> {
>   "expo": {
>    ...
>     "plugins": [
>       [
>         "expo-build-properties",
>         {
>           "android": {
>             "compileSdkVersion": 35,
>             "targetSdkVersion": 34,
>             "buildToolsVersion": "35.0.0",
>             "kotlinVersion": "1.9.25"
>           }
>         }
>       ]
>    ...
>     ],
> Then run:
> 
> ```
> npx expo prebuild --platform android
> npx expo run:android
> ```
> 
> It should work!


## Warning: NODE_ENV

Error message:
> The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set.

## Error: Java OutOfMemeryError

Environment: local build
Command: ``
Error message: 
> java.lang.OutOfMemoryError: Metaspace

Solution: https://github.com/expo/expo/issues/30413#issuecomment-2389968818

> I ended up creating a global `gradle.properties` with the following and it started building:
> 
> ```
> org.gradle.jvmargs=-Xmx14g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
> org.gradle.parallel=true
> org.gradle.configureondemand=true
> org.gradle.daemon=false
> ```
> 
> setting up global gradle properties: https://www.labkey.org/Documentation/wiki-page.view?name=gradleProps#global note on jvmargs: https://stackoverflow.com/a/75897214


## Error: Google Play Submission
Error message:
> The app has permissions that require a privacy policy set for the app.

command: `eas submit --platform android`

Solution:
Followed the expo guideline on [missing privacy policy](https://github.com/expo/fyi/blob/main/missing-privacy-policy.md), and used [termly](https://app.termly.io/) to create a privacy policy. Uploaded it to a temporary GitHub repository: [sjiang1/PrivacyPolicy](https://github.com/sjiang1/PrivacyPolicy/blob/main/privacypolicy.html)

## Failed to submit the app to the store
command: `eas submit --platform android`

The app is in the internal testing, should not be published to the store.

Solution: manually download the aab file from expo, and upload the aab file to Google Play.

**Todo**: probably have another command I can use to upload it to the internal testing stage.